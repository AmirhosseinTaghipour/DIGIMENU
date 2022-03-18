export interface IDatePicker {
    day: number;
    month: number;
    year: number;
}

export interface IOptionParams {
    key: string;
    value: string;
    title: string;
    children: boolean;
}

export interface IComboBoxType {
    key: string;
    value: string;
}

export interface ILazyTreeType {
    id: string;
    pId: string | null;
    value: string | number | undefined;
    title: string;
    isLeaf: boolean | null;
}

export interface IResultType {
    code: number | null;
    message: string | null;
}

export interface IRefTokenValues {
    token: string;
    refreshToken: string;
}

export interface IFieldsMetaData {
    id: string | null;
    fieldName: string | null;
    displayName: string | null;
    placeholder: string | null;
    fieldType: string | null;
    editableStatus: number | null;
    visibleStatus: number | null;
    arrengment: number | null;
    requierdStatus: number | null;
    requierdMessage: string | null;
}


