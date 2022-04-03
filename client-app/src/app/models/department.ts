export interface IDepartmentFormValues {
    Id: string | null;
    title: string | null;
    description: string | null;
    address: string | null;
    postalCode: string | null;
    phone: string | null;
    xpos: number | null;
    ypos: number | null;
    image: Blob | null;
    imageName: string | null;
    imageUrl: string | null;
    logo: Blob | null;
    logoName: string | null;
    logoUrl: string | null;
    isImageChanged: boolean;
    isLogChanged: boolean;
    isUpdateMode:boolean;
}