export interface ISMSLogFormValues {
    id: string | null;
    receiver: string | null;
    mobile: string | null;
    message: string | null;
    keyParam: string | null;
    type: string | null;
    status: string | null;
}

export interface ISMSLogListItemValues {
    key: string | null
    id: string | null;
    receiver: string | null;
    mobile: string | null;
    keyParam: string | null;
    type: string | null;
    status: boolean;
}

export interface ISMSLogListSearchParam {
    userId: string | null
    receiver: string | null;
    mobile: string | null;
    type: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}

export interface ISMSLogListEnvelope {
    smsLogList: ISMSLogListItemValues[];
    smsLogCount: number;
}