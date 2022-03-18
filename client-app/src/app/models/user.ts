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

export interface IRefTokenValues {
    token: string;
    refreshToken: string;
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

export interface IColor {
    color: string;
    time?: number;
}


export interface IRealPersonFormValues {
    name: string | null;
    lastName: string | null;
    mobileNumber: string | null;
    nationalCode: string | null;
    birthDate: string | null;
    fatherName: string | null;
    userName: string | null;
    password: string | null;
    repeatedPassword: string | null;
    sex: number | null;
    domainList: string | null;
    activationCode: string | null;
    token: string | null;
    captchaText: string | null;
}

export interface IRealPerson {
    name: string | null;
    lastName: string | null;
    mobileNumber: string | null;
    nationalCode: string | null;
    birthDate: string | null;
    fatherName: string | null;
    sex: number | null;
}

export interface ICheckNationalCode {
    nationalCode: string | null;
    birthDate: string | null;
}
