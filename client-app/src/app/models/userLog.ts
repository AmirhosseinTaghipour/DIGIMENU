export interface IUserLogFormValues {
    id: string | null;
    name: string | null;
    userName: string | null;
    date: string | null;
    ip: string | null;
    status: string | null;
}

export interface IUserLogListItemValues {
    key: string | null
    id: string | null;
    name: string | null;
    userName: string | null;
    date: string | null;
    ip: string | null;
    status: string | null;
}

export interface IUserLogListSearchParam {
    userId:string | null;
    userName: string | null;
    status: string | null;
    date: string | null;
    ip: string | null;
    sortColumn: string | null;
    sortDirection: string | null;
    limit: number | null;
    page: number | null;
}

export interface IUserLogListEnvelope {
    userLogList: IUserLogListItemValues[];
    userLogCount: number;
}