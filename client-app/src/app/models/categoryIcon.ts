import { IFile } from "./common";
export interface ICategoryIconFormValues {
    id: string | null;
    title: string | null;
    icon: IFile;
    isUpdateMode: boolean;
}

export interface ICategoryIconListItemValues {
    key: string | null
    id: string | null;
    title: string | null;
    url: string | null;
}


export interface ICategoryIconListEnvelope {
    categoryIconList: ICategoryIconListItemValues[];
    categoryIconCount: number;
}

export interface ICategoryIconListSearchParam {
    title: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}