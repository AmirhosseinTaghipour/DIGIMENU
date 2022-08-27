import { observable, computed, action, runInAction, makeAutoObservable } from "mobx";
import { ICaptchaImage, IChangePasswordFormValues, IConfirmCodeFormValues, IForgotPasswordFormValues, ILoginFormValues, IRegisterFormValues, IResendCodeFormValues, IUser, IUserFormValues, IUserManagementFormValues, IUserManagementListItemValues, IUserManagementListSearchParam } from "../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { IComboBoxType } from "../models/common";
import { openNotification } from "../common/util/util";

export default class UserStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable user: IUser | null = null;
    @observable userRolesComboRegistery = new Map();
    @observable captchaImage: ICaptchaImage | null = null;
    @observable loadingCaptchaImage = false;
    @observable loadingRefreshToken = false;
    @observable resendingCode = false;
    @observable submitting = false;
    @observable isChangePasswordMode: boolean = false
    @observable resetCounter: number = 0;

    @action setResetCounter = () => {
        this.resetCounter += 1;
    }

    @action setChangePasswordMode = () => {
        this.isChangePasswordMode = true;
    }

    @action resendCode = async (values: IResendCodeFormValues) => {
        try {
            this.resendingCode = true;
            values.token = this.captchaImage && this.captchaImage!.token;
            const res = await agent.User.resendCode(values);
            runInAction(() => {
                openNotification(
                    "success",
                    "ارسال مجدد",
                    `${res?.message!}`,
                    "topRight");
                this.resendingCode = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.resendingCode = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action login = async (values: ILoginFormValues) => {
        try {
            this.submitting = true;
            values.token = this.captchaImage && this.captchaImage!.token;
            const res = await agent.User.login(values);
            runInAction(() => {
                this.rootStore.commonStore.setToken(res.token);
                this.rootStore.commonStore.setRefToken(res.refreshToken);
                window.location.replace("/");
                this.submitting = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.submitting = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action register = async (values: IRegisterFormValues) => {
        try {
            this.submitting = true;
            values.token = this.captchaImage && this.captchaImage!.token;
            const res = await agent.User.register(values);
            runInAction(() => {
                this.submitting = false;
                openNotification(
                    "success",
                    "ثبت نام",
                    `${res?.message!}`,
                    "topRight");
            })
        } catch (err: any) {
            runInAction(() => {
                this.submitting = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action getCaptchaImage = async () => {
        try {
            this.loadingCaptchaImage = true;
            const res = await agent.User.GetCaptchaImage();
            runInAction(() => {
                this.captchaImage = res;
                this.loadingCaptchaImage = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loadingCaptchaImage = false;
                throw error;
            });
        }
    };

    @action forgotPassword = async (values: IForgotPasswordFormValues) => {
        try {
            this.submitting = true;
            values.token = this.captchaImage && this.captchaImage!.token;
            const res = await agent.User.forgotPassword(values);
            runInAction(() => {
                this.setChangePasswordMode();
                this.submitting = false;
                openNotification(
                    "success",
                    "بازیابی کلمه عبور",
                    `${res?.message!}`,
                    "topRight");
            });
        } catch (err: any) {
            runInAction(() => {
                this.submitting = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action confirmSMS = async (values: IConfirmCodeFormValues) => {
        try {
            this.submitting = true;
            values.token = this.captchaImage && this.captchaImage!.token;
            values.isChangePasswordMode = this.isChangePasswordMode
            const res = await agent.User.confirmSMS(values);
            runInAction(() => {
                this.rootStore.commonStore.setToken(res.token);
                this.rootStore.commonStore.setRefToken(res.refreshToken);
                this.submitting = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.submitting = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action changePassword = async (values: IChangePasswordFormValues) => {
        try {
            this.submitting = true;
            const res = await agent.User.changePassword(values);
            runInAction(() => {
                this.user = null;
                openNotification(
                    "success",
                    "تغییر رمز عبور",
                    `${res?.message!}`,
                    "topRight");
                this.submitting = false;
                window.location.replace("/");
            });
        } catch (err: any) {
            runInAction(() => {
                this.submitting = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action getUser = async () => {
        try {
            this.submitting = true;
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
                this.submitting = false;
            });
        } catch (err: any) {
            this.submitting = false;
            throw err;
            window.location.replace("/");
        }
    };

    @action logout = () => {
        runInAction(() => {
            this.rootStore.commonStore.setToken(null);
            this.rootStore.commonStore.setRefToken(null);
            window.location.replace("/");
        })
    };

    @computed get UserRolesList() {
        return Array.from(this.userRolesComboRegistery.values());
    }

    @computed get isLoggedIn() {
        return !!this.user;
    }
    /* this section is about user management */

    @observable sumbittingUser = false;
    @observable deletingUser = false;
    @observable loadingUser = false;
    @observable loadingUserList = false;
    @observable userListRegistery = new Map();
    @observable userCount = 0;
    @observable userListValues: IUserManagementListSearchParam = {
        name: null,
        userName: null,
        departmentName: null,
        roleName: null,
        mobile: null,
        sortColumn: null,
        sortDirection: null,
        limit: 10,
        page: 1,
        departmentId: null
    };

    @action setUserListValues = async(values: IUserManagementListSearchParam) => {
        if (!!values) {
            this.userListValues.userName = values.userName;
            this.userListValues.name = values.name;
            this.userListValues.departmentName = values.departmentName;
            this.userListValues.name = values.name;
            this.userListValues.mobile = values.mobile;
            this.userListValues.sortColumn = values.sortColumn;
            this.userListValues.sortDirection = values.sortDirection;
            this.userListValues.limit = values.limit;
            this.userListValues.page = values.page;
            this.userListValues.departmentId = values.departmentId;
        }
    };

    @observable userInfo: IUserManagementFormValues = {
        id: null,
        name: null,
        userName: null,
        password: null,
        departmentId: null,
        roleId: null,
        isActivated: false,
        mobile: null,
        isUpdateMode: false
    };

    @action setUserInfo = (values: IUserManagementFormValues) => {
        debugger;
        if (!!values) {
            this.userInfo.id = values.id;
            this.userInfo.name = values.name;
            this.userInfo.userName = values.userName;
            this.userInfo.password = values.password;
            this.userInfo.departmentId = values.departmentId;
            this.userInfo.roleId = values.roleId;
            this.userInfo.isActivated = values.isActivated;
            this.userInfo.mobile = values.mobile;
            this.userInfo.isUpdateMode = values.isUpdateMode;
        }
    }

    @action loadUser = async (id:string) => {
        try {
            this.loadingUser = true;
            const res = await agent.User.getUser(id);
            runInAction(() => {
                this.setUserInfo({...res});
                this.loadingUser = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingUser = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action loadUserList = async () => {
        try {
            this.loadingUserList = true;
            
            const res = await agent.User.getUserList(this.userListValues);
            runInAction(() => {
                const { userList, userCount } = res;
                this.userListRegistery.clear();

                if (userList && userList.length > 0 ) {
                    userList.forEach( ( item : IUserManagementListItemValues ) => {
                        this.userListRegistery.set( item.key, item );
                    } )
                }

                if (typeof userCount == "number" ) {
                    this.userCount = userCount;
                }
            });
            this.loadingUserList = false;

        } catch (err: any) {
            runInAction(() => {
                this.loadingUserList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action insertUser = async (values: IUserManagementFormValues) => {
        try {
            this.sumbittingUser = true;
            const res = await agent.User.insertUser(values);
            runInAction(() => {
                this.userInfo.isUpdateMode = false;
                this.loadUserList();
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingUser = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingUser = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action updateUser = async (values: IUserManagementFormValues) => {
        try {
            this.sumbittingUser = true;
            const res = await agent.User.updateUser(values);
            runInAction(() => {
                this.loadUserList();
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingUser = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingUser = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action deleteUser = async (ids: string[]) => {
        try {
            this.deletingUser = true;
            const res = await agent.User.deleteUser(ids);
            runInAction(() => {
                this.loadUserList();
                openNotification("success",
                    "حذف اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.deletingUser = false;
            });
        }
        catch (err: any) {
            runInAction(() => {
                this.deletingUser = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    }

    @computed get userList() {
        return Array.from(this.userListRegistery.values());
    }
}
