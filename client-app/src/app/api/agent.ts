import axios, { AxiosResponse } from "axios";
import { openNotification, jsonToFormData } from "../common/util/util";
import { ICaptchaImage, IChangePasswordFormValues, IConfirmCodeFormValues, IForgotPasswordFormValues, ILoginFormValues, IRegisterFormValues, IResendCodeFormValues, IUser, IUserFormValues } from "../models/user";
import { IComboBoxType, IRefTokenValues, IResultType } from "../models/common";

import { AddCookie, GetCookie, RemoveCookie } from "../common/util/util";
import { values } from "mobx";
import { IAppMenu } from "../models/main";
import { IDepartmentFormValues } from "../models/department";
import { IMenuFormValues } from "../models/menu";
import { ICategoryFormValues, ICategoryListEnvelope, ICategoryListOreder, ICategoryListSearchParam } from "../models/category";
import { ICategoryIconFormValues, ICategoryIconListEnvelope, ICategoryIconListItemValues, ICategoryIconListSearchParam } from "../models/categoryIcon";

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




export default {
    User,
    Main,
    Department,
    Menu,
    Category,
    CategoryIcon
};
