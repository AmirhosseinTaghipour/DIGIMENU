import { IFile } from "./common";
export interface ICategoryFormValues {
    Id: string | null;
    title: string | null;
    order: number | null;
    icon: IFile;
    isUpdateMode: boolean;
}