import { IFile } from "./common";
export interface IFileFormValues {
    id: string | null;
    entityName: string | null;
    entityId: string | null;
    title: string | null;
    file: IFile;
    isDefault: boolean;
    isUpdateMode: boolean;
}

export interface IFileListItemValues {
    key: string | null
    id: string | null;
    title: string | null;
    isDefault: boolean;
    url: string | null;
}


export interface IFileListEnvelope {
    fileList: IFileListItemValues[];
    fileCount: number;
}

export interface IFileListSearchParam {
    entityName: string | null;
    entityId: string | null;
    title: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}