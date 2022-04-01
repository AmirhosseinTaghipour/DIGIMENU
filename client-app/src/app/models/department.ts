import { UploadFile } from "antd/lib/upload/interface";

export interface IDepartmentFormValues {
    title: string | null;
    description: string | null;
    address: string | null;
    postalCode: string | null;
    phone: string | null;
    xpos: number | null;
    ypos: number | null;
    image: Blob | null;
    logo: Blob | null;
}