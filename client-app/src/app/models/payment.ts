
export interface IPaymentFormValues {
    id: string | null;
    type: number | null;
    isUpdateMode: boolean;
}

export interface IPaymentResult {
    pId: string | null;
    refId: string | null;
    pTime: string | null;
    pDate: string | null;
    amount: string | null;
    message: string | null;
    isPaid: boolean;
}

export interface IPaymentListItemValues {
    key: string | null
    id: string | null;
    pId:string | null;
    title: string | null;
    status: number | null;
    statusTitle: string | null;
    amount: string | null;
    pDate: string | null;
    pTime: string | null;
    expireDate: string | null;
    isActivated: boolean;
}

export interface IPaymentListSearchParam {
    departmentId: string | null;
    title: string | null;
    statusTitle: string | null;
    pId: string | null;
    department: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}

export interface IPaymentEnvelope {
    paymentList: IPaymentListItemValues[];
    paymentCount: number;
}