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