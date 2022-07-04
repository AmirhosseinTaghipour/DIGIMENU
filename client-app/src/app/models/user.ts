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

export interface IUserManagementFormValues{
    id:string |null;
    name: string|null;
    userName: string|null;
    password: string|null;
    departmentId: string|null;
    roleId: string|null;
    isActivated: boolean;
    mobile: string|null;
    isUpdateMode: boolean;
}
export interface IUserManagementListItemValues{
    id:string;
    key:string
    name: string;
    userName: string;
    departmentName: string;
    roleName: string;
    isActivated: boolean;
    mobile: string;
}

export interface IUserManagementListSearchParam {
    name: string | null;
    userName: string | null;
    departmentName: string | null;
    roleName: string | null;
    mobile: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}

export interface IUserManagementEnvelope {
    userList: IUserManagementListItemValues[];
    userCount: number;
}