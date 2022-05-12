export interface ICategoryFormValues {
    id: string | null;
    title: string | null;
    iconId: string|null;
    isUpdateMode: boolean;
}

export interface ICategoryListItemValues {
    key: string | null
    order:number|null;
    id: string | null;
    title: string | null;
    url: string | null;
}

export interface ICategoryListSearchParam {
    title: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}

export interface ICategoryListEnvelope {
    categoryList: ICategoryListItemValues[];
    categoryCount: number;
}

export interface ICategoryListOreder {
    id: string | null
    movement: number | null;
    limit: number | null;
    page: number | null;
}