import { observable, computed, action, runInAction, makeAutoObservable } from "mobx";
import { ICaptchaImage, IChangePasswordFormValues, ICheckNationalCode, IConfirmCodeFormValues, IForgotPasswordFormValues, ILoginFormValues, IRegisterFormValues, IResendCodeFormValues, IUser, IUserFormValues } from "../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { IComboBoxType } from "../models/common";
import { openNotification } from "../common/util/util";
import { BsTextIndentRight } from "react-icons/bs";

export default class UserStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable user: IUser | null = null;
    @observable submitting = false;
    @observable userRolesComboRegistery = new Map();
    @observable captchaImage: ICaptchaImage | null = null;
    @observable loadingCaptchaImage = false;
    @observable loadingRefreshToken = false;
    @observable resendingCode = false;
    @observable isChangePasswordMode: boolean = false
    @observable resetCounter: number = 0;


    @action setResetCounter = () => {
        this.resetCounter += 1;
    }

    @action setChangePasswordMode = () => {
        this.isChangePasswordMode = true;
    }

    @action resendCode = async (values:IResendCodeFormValues) => { 
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



    @action createNewRefreshToken = async () => {

        try {
            this.loadingRefreshToken = true;
            const res = await agent.User.createRefreshToken();
            runInAction(() => {
                this.rootStore.commonStore.setRefToken(res);
                this.loadingRefreshToken = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingRefreshToken = false;
                throw error;
            })
        }
    };


    @computed get UserRolesList() {
        return Array.from(this.userRolesComboRegistery.values());
    }

    @computed get isLoggedIn() {
        return !!this.user;
    }
}
