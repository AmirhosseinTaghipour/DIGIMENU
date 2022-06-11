export interface ICategoryItemFormValues {
    id: string | null;
    title: string | null;
    categoryId: string | null;
    price: number | null;
    discount: number | null;
    discountType: number | null;
    description: string | null;
    isExist: boolean;
    useDiscount: boolean;
    isUpdateMode: boolean;
}

export interface ICategoryItemListItemValues {
    key: string | null
    order: number | null;
    categoryorder: number | null;
    id: string | null;
    title: string | null;
    categoryTitle: string | null;
    categoryId: string | null;
    price: number | null;
    discountPercent: number | null;
    discountValue: number | null;
    isExist: boolean;
    url: string | null;
}

export interface ICategoryItemListSearchParam {
    categoryId: string | null;
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