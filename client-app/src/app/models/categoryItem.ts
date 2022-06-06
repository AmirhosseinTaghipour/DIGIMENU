export interface ICategoryItemFormValues {
    id: string | null;
    title: string | null;
    categoryId: string|null;
    price: number | null;
    discount: number | null;
    discountType: number | null;
    description: string | null;
    isExist: string | null;
    isUpdateMode: boolean;
}

export interface ICategoryItemListItemValues {
    key: string | null
    order:number|null;
    id: string | null;
    title: string | null;
    categoryTitle: string | null;
    price: string | null;
    isExist: string | null;
    url: string | null;
}

export interface ICategoryItemListSearchParam {
    title: string | null;
    categoryTitle: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}

export interface ICategoryItemListEnvelope {
    categoryItemList: ICategoryItemListItemValues[];
    categoryItemCount: number;
}

export interface ICategoryItemListOreder {
    id: string | null
    categoryId: string | null
    movement: number | null;
    limit: number | null;
    page: number | null;
}