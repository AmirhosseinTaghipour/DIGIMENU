import { IFile } from "./common";
export interface ICategoryFormValues {
    Id: string | null;
    title: string | null;
    order: number | null;
    iconId: string|null;
    isUpdateMode: boolean;
}