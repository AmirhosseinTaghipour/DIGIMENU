import axios, { AxiosResponse } from "axios";
import { openNotification, jsonToFormData } from "../common/util/util";
import { ICaptchaImage, IChangePasswordFormValues, IConfirmCodeFormValues, IForgotPasswordFormValues, ILoginFormValues, IRegisterFormValues, IResendCodeFormValues, IUser, IUserFormValues, IUserManagementEnvelope, IUserManagementFormValues, IUserManagementListItemValues, IUserManagementListSearchParam } from "../models/user";
import { IComboBoxType, IRefTokenValues, IResultType } from "../models/common";

import { AddCookie, GetCookie, RemoveCookie } from "../common/util/util";
import { values } from "mobx";
import { IAppMenu } from "../models/main";
import { IDepartmentFormValues, IDepartmentManagementEnvelope, IDepartmentManagementFormValues, IDepartmentManagementListSearchParam } from "../models/department";
import { IMenuFormValues } from "../models/menu";
import { ICategoryFormValues, ICategoryListEnvelope, ICategoryListOreder, ICategoryListSearchParam } from "../models/category";
import { ICategoryIconFormValues, ICategoryIconListEnvelope, ICategoryIconListItemValues, ICategoryIconListSearchParam } from "../models/categoryIcon";
import { ICategoryItemFormValues, ICategoryItemListEnvelope, ICategoryItemListOreder, ICategoryItemListSearchParam } from "../models/categoryItem";
import { IFileFormValues, IFileListEnvelope, IFileListSearchParam } from "../models/file";
import { ISMSLogFormValues, ISMSLogListEnvelope, ISMSLogListSearchParam } from "../models/smsLog";
import { IUserLogFormValues, IUserLogListEnvelope, IUserLogListSearchParam } from "../models/userLog";
import { IPaymentEnvelope, IPaymentFormValues, IPaymentListSearchParam, IPaymentResult } from "../models/payment";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
    async (config) => {
        // const token = window.localStorage.getItem("limstoken");
        const token = GetCookie("bstoken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers["Access-Control-Allow-Origin"] = "*";
            config.headers["Access-Control-Allow-Credentials"] = true;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (resError) => {
        const originalConfig = resError.config;
        const reftoken = GetCookie("bsreftoken");
        if (resError.message === "Network Error" && !resError.response) {
            openNotification(
                "error",
                "خطای سرور",
                "از اجرای برنامه سرور اطمینان حاصل کنید",
                "bottomLeft"
            );
        }
        else {
            if (String(originalConfig.url).includes("user/RefreshToken") && resError.response.status === 401) {
                RemoveCookie("bstoken");
                RemoveCookie("bsreftoken");
                window.location.replace("/");
            }

            if (resError.response) {
                // Access Token was expired
                if (resError.response.status === 401 && !!reftoken) {
                    try {
                        const rs = await axios.post("/user/RefreshToken", {
                            refreshToken: reftoken,
                        });
                        const accessToken: IRefTokenValues = rs.data;
                        if (accessToken == null || accessToken == undefined) {
                            RemoveCookie("bstoken");
                            RemoveCookie("bsreftoken");
                            window.location.replace("/");
                        }
                        AddCookie("bstoken", accessToken.token);
                        AddCookie("bsreftoken", accessToken.refreshToken);
                        originalConfig.headers.Authorization = `Bearer ${accessToken.token}`;
                        return axios(originalConfig);

                    } catch (_error) {
                        RemoveCookie("bstoken");
                        RemoveCookie("bsreftoken");
                        window.location.replace("/");
                    }
                }
                else if (resError.response.status === 401 && !reftoken) {
                    RemoveCookie("bstoken");
                    RemoveCookie("bsreftoken");
                    window.location.replace("/");
                }
                else if (resError.response.status === 500) {
                    openNotification(
                        "error",
                        "خطای سرور",
                        "خطای سرور رخ داده است",
                        "bottomLeft"
                    );
                }
            }
        }
        return Promise.reject(resError);
    }
);

const responseBody = (response: AxiosResponse | undefined) => {
    if (response != undefined) {
        return response.data;
    }
};


const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),

    postForm: (url: string, body: {}) => {
        let formData = jsonToFormData(body);
        console.log(formData);
        return axios.post(url, formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        }).then(responseBody)

    }

};

const User = {
    current: (): Promise<IUser> => requests.get("/user"),

    login: (values: ILoginFormValues): Promise<IRefTokenValues> =>
        requests.post("/user/Login", values),

    register: (values: IRegisterFormValues): Promise<IResultType> =>
        requests.post("/user/UserRegister", values),

    forgotPassword: (values: IForgotPasswordFormValues): Promise<IResultType> =>
        requests.post("/user/ForgetPassword", values),

    confirmSMS: (values: IConfirmCodeFormValues): Promise<IRefTokenValues> =>
        requests.post("/user/ConfirmSMS", values),

    changePassword: (values: IChangePasswordFormValues): Promise<IResultType> =>
        requests.post("/user/ChangePassword", values),

    resendCode: (values: IResendCodeFormValues): Promise<IResultType> =>
        requests.post("/user/ResendCode", values),

    GetCaptchaImage: (): Promise<ICaptchaImage> =>
        requests.get("/user/CaptchaImage"),

    insertUser: (values: IUserManagementFormValues): Promise<IResultType> =>
        requests.post("/user/UserInsert", values),

    updateUser: (values: IUserManagementFormValues): Promise<IResultType> =>
        requests.post("/user/UserUpdate", values),

    deleteUser: (ids: string[]): Promise<IResultType> =>
        requests.post("/user/UserDelete", { ids }),

    getUserList: (values: IUserManagementListSearchParam): Promise<IUserManagementEnvelope> =>
        requests.post("/user/UserList", values),

    getUser: (id: string): Promise<IUserManagementFormValues> =>
        requests.post("/user/userLoad", { id }),


};

const Main = {
    getAppMenu: (): Promise<IAppMenu[]> => requests.get("/main/GetAppMenu"),
};

const Department = {
    insertDepartmentInfo: (values: IDepartmentFormValues): Promise<IResultType> =>
        requests.postForm("/department/DepartmentInsert", values),

    updateDepartmentInfo: (values: IDepartmentFormValues): Promise<IResultType> =>
        requests.postForm("/department/DepartmentUpdate", values),

    getDepartmentInfo: (): Promise<IDepartmentFormValues> =>
        requests.get("/department/DepartmentLoad"),

    getDepartmentList: (): Promise<IComboBoxType[]> =>
        requests.get("/department/GetAllDepartment"),

    getDepartmentManagementInfo: (id: string): Promise<IDepartmentManagementFormValues> =>
        requests.post("/department/DepartmentManagementLoad", { id }),

    getDepartmentManagementList: (values: IDepartmentManagementListSearchParam): Promise<IDepartmentManagementEnvelope> =>
        requests.post("/department/DepartmentManagementList", values),

    updateDepartmentManagement: (values: IDepartmentManagementFormValues): Promise<IResultType> =>
        requests.post("/department/DepartmentManagementUpdate", values),
}

const Role = {
    getRoleList: (): Promise<IComboBoxType[]> =>
        requests.get("/role/GetAllRole"),
}

const Menu = {
    insertMenu: (values: IMenuFormValues): Promise<IResultType> =>
        requests.post("/menu/MenuInsert", values),

    updateMenu: (values: IMenuFormValues): Promise<IResultType> =>
        requests.post("/menu/MenuUpdate", values),

    getMenuInfo: (): Promise<IMenuFormValues> =>
        requests.get("/menu/MenuLoad"),
}

const Category = {
    insertCategory: (values: ICategoryFormValues): Promise<IResultType> =>
        requests.post("/category/CategoryInsert", values),

    updateCategory: (values: ICategoryFormValues): Promise<IResultType> =>
        requests.post("/category/CategoryUpdate", values),

    deleteCategory: (ids: string[]): Promise<IResultType> =>
        requests.post("/category/CategoryDelete", { ids }),

    getCategoryList: (values: ICategoryListSearchParam): Promise<ICategoryListEnvelope> =>
        requests.post("/category/CategoryList", values),

    setCategoryListOrder: (values: ICategoryListOreder): Promise<ICategoryListEnvelope> =>
        requests.post("/category/CategoryListOrder", values),

    getCategory: (id: string): Promise<ICategoryFormValues> =>
        requests.post("/category/CategoryLoad", { id }),
}

const SMSLog = {
    getSMSLogList: (values: ISMSLogListSearchParam): Promise<ISMSLogListEnvelope> =>
        requests.post("/smsLog/SMSLogList", values),

    getSMSLog: (id: string): Promise<ISMSLogFormValues> =>
        requests.post("/smsLog/SMSLogLoad", { id }),
}

const UserLog = {
    getUserLogList: (values: IUserLogListSearchParam): Promise<IUserLogListEnvelope> =>
        requests.post("/userLog/UserLogList", values),

    getUserLog: (id: string): Promise<IUserLogFormValues> =>
        requests.post("/userLog/UserLogLoad", { id }),
}

const CategoryIcon = {
    insertCategoryIcon: (values: ICategoryIconFormValues): Promise<IResultType> =>
        requests.postForm("/categoryIcon/CategoryIconInsert", values),

    updateCategoryIcon: (values: ICategoryIconFormValues): Promise<IResultType> =>
        requests.postForm("/categoryIcon/CategoryIconUpdate", values),

    deleteCategoryIcon: (id: string): Promise<IResultType> =>
        requests.post("/categoryIcon/CategoryIconDelete", { id }),

    getCategoryIconList: (values: ICategoryIconListSearchParam): Promise<ICategoryIconListEnvelope> =>
        requests.post("/categoryIcon/CategoryIconList", values),

    getCategoryIcon: (id: string): Promise<ICategoryIconFormValues> =>
        requests.post("/categoryIcon/CategoryIcon", { id }),
}

const CategoryItem = {
    insertCategoryItem: (values: ICategoryItemFormValues): Promise<IResultType> =>
        requests.post("/categoryItem/CategoryItemInsert", values),

    updateCategoryItem: (values: ICategoryItemFormValues): Promise<IResultType> =>
        requests.post("/categoryItem/CategoryItemUpdate", values),

    deleteCategoryItem: (ids: string[]): Promise<IResultType> =>
        requests.post("/categoryItem/CategoryItemDelete", { ids }),

    getCategoryItemList: (values: ICategoryItemListSearchParam): Promise<ICategoryItemListEnvelope> =>
        requests.post("/categoryItem/CategoryItemList", values),

    setCategoryItemListOrder: (values: ICategoryItemListOreder): Promise<ICategoryItemListEnvelope> =>
        requests.post("/categoryItem/CategoryItemListOrder", values),

    getCategoryItem: (id: string): Promise<ICategoryItemFormValues> =>
        requests.post("/categoryItem/CategoryItemLoad", { id }),
}

const File = {
    insertFile: (values: IFileFormValues): Promise<IResultType> =>
        requests.postForm("/file/FileInsert", values),

    updateFile: (values: IFileFormValues): Promise<IResultType> =>
        requests.postForm("/file/FileUpdate", values),

    deleteFile: (id: string): Promise<IResultType> =>
        requests.post("/file/FileDelete", { id }),

    getFileList: (values: IFileListSearchParam): Promise<IFileListEnvelope> =>
        requests.post("/file/FileList", values),

    getFile: (id: string): Promise<IFileFormValues> =>
        requests.post("/file/FileLoad", { id }),
}

const Payment = {
    insertPayment: (values: IPaymentFormValues): Promise<IResultType> =>
        requests.post("/payment/PaymentInsert", values),

    updatePayment: (values: IPaymentFormValues): Promise<IResultType> =>
        requests.post("/payment/PaymentUpdate", values),

    getPaymentList: (values: IPaymentListSearchParam): Promise<IPaymentEnvelope> =>
        requests.post("/payment/PaymenteList", values),

    getUnitPaymentList: (values: IPaymentListSearchParam): Promise<IPaymentEnvelope> =>
        requests.post("/payment/UnitPaymentList", values),

    payment: (paymentId: string): Promise<IResultType> =>
        requests.post("/payment/Payment", { paymentId}),

    checkPayment: (paymentId: string): Promise<IPaymentResult> =>
        requests.post("/payment/CheckPayment", { paymentId}),
}



export default {
    User,
    Main,
    Department,
    Role,
    Menu,
    Category,
    CategoryIcon,
    CategoryItem,
    File,
    SMSLog,
    UserLog,
    Payment
};
