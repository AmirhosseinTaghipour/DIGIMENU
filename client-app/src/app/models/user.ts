export interface IUser {
    userId: string;
    userName: string;
    userTitle: string;
    departmentId: string;
    departmentName: string;
    roleId: string;
    roleCode: string;
    roleTitle: string;
}

export interface ILoginFormValues {
    userName: string;
    password: string;
    captchaText: string;
    token: string | null;
}

export interface IForgotPasswordFormValues {
    userName: string;
    mobile: string;
    captchaText: string;
    token: string | null;
}

export interface IRegisterFormValues {
    name: string;
    mobile: string;
    userName: string;
    password: string;
    repreatedPassword: string;
    captchaText: string;
    token: string | null;
}

export interface IUserFormValues {
    username: string;
    password: string;
    displayName?: string;
    captchaText?: string;
    confirmCode?: string;
    repeatPassword?: string;
    token: string | null;
}

export interface ICaptchaImage {
    image: string | null;
    token: string | null;
}

export interface IConfirmCodeFormValues {
    userName: string | null;
    code: string | null;
    isChangePasswordMode: boolean | null;
    captchaText: string;
    token: string | null;
}

export interface IResendCodeFormValues {
    userName: string | null;
    mobile: string | null;
    isChangePasswordMode: boolean | null;
    captchaText: string;
    token: string | null;
}

export interface IChangePasswordFormValues {
    password: string;
    repeatedPassword: string;
}

export interface ICheckNationalCode {
    nationalCode: string | null;
    birthDate: string | null;
}