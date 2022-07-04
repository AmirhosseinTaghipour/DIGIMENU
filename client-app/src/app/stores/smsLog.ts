import { observable, computed, action, runInAction, makeAutoObservable, values } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { ISMSLogFormValues, ISMSLogListItemValues, ISMSLogListSearchParam } from "../models/smsLog";
import { RootStore } from "./rootStore";

export default class SMSLogStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable loadingSMSLogList = false;
    @observable loadingSMSLog = false;
    @observable smsLogCount = 0;
    @observable smsLogRegistery = new Map();

    @observable smsLogListValues: ISMSLogListSearchParam = {
        userId: null,
        receiver: null,
        mobile: null,
        type: null,
        sortColumn: null,
        sortDirection: null,
        limit: 10,
        page: 1,
    };

    @action setSMSLogListValues = async (values: ISMSLogListSearchParam) => {
        if (!!values) {
            this.smsLogListValues.userId = values.userId;
            this.smsLogListValues.receiver = values.receiver;
            this.smsLogListValues.mobile = values.mobile;
            this.smsLogListValues.type = values.type;
            this.smsLogListValues.sortColumn = values.sortColumn;
            this.smsLogListValues.sortDirection = values.sortDirection;
            this.smsLogListValues.limit = values.limit;
            this.smsLogListValues.page = values.page;
        }
    };

    @observable smsLogInfo: ISMSLogFormValues = {
        id: null,
        receiver: null,
        mobile: null,
        message: null,
        keyParam: null,
        type: null,
        status: null
    };

    @action setSMSLogInfo = (values: ISMSLogFormValues) => {
        if (!!values) {
            this.smsLogInfo.id = values.id;
            this.smsLogInfo.receiver = values.receiver;
            this.smsLogInfo.mobile = values.mobile;
            this.smsLogInfo.message = values.message;
            this.smsLogInfo.keyParam = values.keyParam;
            this.smsLogInfo.type = values.type;
            this.smsLogInfo.status = values.status;
        }
    }

    @action loadSMSLogList = async () => {
        try {
            this.loadingSMSLogList = true;
            const res = await agent.SMSLog.getSMSLogList(this.smsLogListValues);
            runInAction(() => {
                const { smsLogList, smsLogCount } = res;
                this.smsLogRegistery.clear();

                if (smsLogList && smsLogList.length > 0 ) {
                    smsLogList.forEach( ( item : ISMSLogListItemValues ) => {
                        this.smsLogRegistery.set( item.key, item );
                    } )
                }

                if (typeof smsLogCount == "number" ) {
                    this.smsLogCount = smsLogCount;
                }

                this.loadingSMSLogList = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingSMSLogList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    }

    @action loadSMSLog = async (id:string) => {
        try {
            this.loadingSMSLog = true;
            const res = await agent.SMSLog.getSMSLog(id);
            runInAction(() => {
                this.setSMSLogInfo({...res});
                this.loadingSMSLog = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingSMSLog = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @computed get smsLogList() {
        return Array.from(this.smsLogRegistery.values());
    }
}
