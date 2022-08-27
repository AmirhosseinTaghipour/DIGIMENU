
export interface IPaymentFormValues {
    id: string | null;
    type: number | null;
    isUpdateMode: boolean;
}

export interface IPaymentListItemValues {
    key: string | null
    id: string | null;
    pId:string | null;
    title: string | null;
    amount: string | null;
    pDate: string | null;
    pTime: string | null;
    expireDate: string | null;
    isActivated: boolean;
}

export interface IPaymentListSearchParam {
    entityId: string | null;
    title: string | null;
    pId: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}

export interface IPaymentEnvelope {
    paymentList: IPaymentListItemValues[];
    paymentCount: number;
}