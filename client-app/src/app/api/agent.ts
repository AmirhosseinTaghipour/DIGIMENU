import axios, { AxiosResponse } from "axios";
/*import { toast } from "react-toastify";*/
import { openNotification, jsonToFormData } from "../common/util/util";
import { ICaptchaImage, ICheckNationalCode, IForgotPasswordFormValues, ILoginFormValues, IRealPerson, IRealPersonFormValues, IRegisterFormValues, IUser, IUserFormValues } from "../models/user";

import { IMainMenu } from "../models/main";

import { IComboBoxType, IRefTokenValues, IResultType } from "../models/common";

import { AddCookie, GetCookie, RemoveCookie } from "../common/util/util";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
    async (config) => {
        // const token = window.localStorage.getItem("limstoken");
        const token = GetCookie("bstoken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers["Access-Control-Allow-Origin"] = "*";
            /*     config.headers[ "Origin" ] = window.origin;*/
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

        const reftoken = GetCookie("bsrefToken");
        if (String(resError.config.url).includes("user/refreshtoken") && !(reftoken && reftoken.length > 10) || (resError.response.status === 401 && originalConfig._retry)) {
            RemoveCookie("bsmtoken");
            RemoveCookie("bsreftoken");
            window.location.href = "/login";
            return Promise.reject(resError);
        }

        if (resError.message === "Network Error" && !resError.response) {
            openNotification(
                "error",
                "خطای سرور",
                "از اجرای برنامه سرور اطمینان حاصل کنید",
                "bottomLeft"
            );
        }

        if (resError.response) {
            // Access Token was expired
            if (resError.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await axios.post("/user/refreshtoken", {
                        reftoken: reftoken,
                    });
                    const accessToken: IRefTokenValues = rs.data;
                    if (accessToken == null || accessToken == undefined) {
                        RemoveCookie("bstoken");
                        RemoveCookie("bsreftoken");
                        window.location.href = "/login";
                        return Promise.reject(resError);
                    }

                    AddCookie("bstoken", `${accessToken.token}`);
                    AddCookie("bsreftoken", `${accessToken.refreshToken}`);

                    originalConfig.headers.Authorization = `Bearer ${accessToken.token}`;
                    return axios(originalConfig);
                } catch (_error) {
                    RemoveCookie("bstoken");
                    RemoveCookie("bsreftoken");
                    window.location.href = "/login";
                    return Promise.reject(resError);
                }
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

        return axios.post(url, formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        }).then(responseBody)

    }

};

const User = {
    current: (): Promise<IUser> => requests.get("/user"),

    login: (user: ILoginFormValues): Promise<IRefTokenValues> =>
        requests.post("/user/Login", user),

    register: (user: IRegisterFormValues): Promise<IResultType> =>
        requests.post("/user/UserRegister", user),

    createRefreshToken: (): Promise<string> =>
        requests.post("/user/Refreshtoken", {}),

    forgotPassword: (user: IForgotPasswordFormValues): Promise<IResultType> =>
        requests.post("/user/ForgetPassword", user),

    confirmSMS: (user: IUserFormValues): Promise<IUser> =>
        requests.post("/user/confirmSMS", user),

    changePassword: (user: IUserFormValues): Promise<IUser> =>
        requests.post("/user/changePassword", user),

    GetCurrentUserDefaultRoleCode: (): Promise<string> =>
        requests.get("/user/defaultrolecode"),

    GetCurrentDepartmentId: (): Promise<string> =>
        requests.get("/user/userdepartmentid"),

    GetCurrentUserRoles: (): Promise<IComboBoxType[]> =>
        requests.get("/user/CurrentUserRoles"),

    SetCurrentUserDefaultRole: (id: string): Promise<void> =>
        requests.post("/user/SetDefaultRole", { id }),

    GetSelectedWorkflowColors: (): Promise<string[]> =>
        requests.get("/User/selectedWorkflowColors"),

    GetCaptchaImage: (): Promise<ICaptchaImage> =>
        requests.get("/User/CaptchaImage"),

    RegisterRrealPerson: (realPerson: IRealPersonFormValues): Promise<IResultType> =>
        requests.post("/user/realPersonRegister", realPerson),

    SendRealPersonConfirmCode: (realPerson: IRealPersonFormValues): Promise<IResultType> =>
        requests.post("/user/realPersonSendConfirmCode", realPerson),

    RealPersonCheckNationalCode: (value: ICheckNationalCode): Promise<IRealPerson> =>
        requests.post("/user/realPersonCheckNationalCode", value),
};

const Main = {
    getMainMenu: (): Promise<IMainMenu[]> => requests.get("/main/menu"),
};





export default {
    User,
    Main
};
