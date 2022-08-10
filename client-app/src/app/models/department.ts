import { IFile } from "./common";

export interface IDepartmentFormValues {
    Id: string | null;
    title: string | null;
    description: string | null;
    address: string | null;
    postalCode: string | null;
    phone: string | null;
    xpos: number | null;
    ypos: number | null;
    image: IFile;
    logo: IFile;
    isUpdateMode: boolean;
}

export interface IDepartmentManagementFormValues {
    id: string | null;
    title: string | null;
    description: string | null;
    address: string | null;
    postalCode: string | null;
    phone: string | null;
    isActivated: boolean;
    isUpdateMode: boolean;
}

export interface IDepartmentManagementListItemValues {
    key: string | null
    id: string | null;
    title: string | null;
    postalCode: string | null;
    phone: string | null;
    isActivated: boolean;
}

export interface IDepartmentManagementListSearchParam {
    title: string | null
    postalCode: string | null;
    phone: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}

export interface IDepartmentManagementEnvelope {
    departmentList: IDepartmentManagementListItemValues[];
    departmentCount: number;
}