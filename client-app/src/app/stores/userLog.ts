import { observable, computed, action, runInAction, makeAutoObservable, values } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { IUserLogFormValues, IUserLogListItemValues, IUserLogListSearchParam } from "../models/userLog";
import { RootStore } from "./rootStore";

export default class UserLogStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable loadingUserLogList = false;
    @observable loadingUserLog = false;
    @observable userLogCount = 0;
    @observable userLogRegistery = new Map();

    @observable userLogListValues: IUserLogListSearchParam = {
        userId: null,
        userName: null,
        status: null,
        date: null,
        ip: null,
        sortColumn: null,
        sortDirection: null,
        limit: 10,
        page: 1,
    };

    @action setUserLogListValues = async(values: IUserLogListSearchParam) => {
        if (!!values) {
            this.userLogListValues.userId = values.userId;
            this.userLogListValues.userName = values.userName;
            this.userLogListValues.status = values.status;
            this.userLogListValues.date = values.date;
            this.userLogListValues.ip = values.ip;
            this.userLogListValues.sortColumn = values.sortColumn;
            this.userLogListValues.sortDirection = values.sortDirection;
            this.userLogListValues.limit = values.limit;
            this.userLogListValues.page = values.page;
        }
    };

    @observable userLogInfo: IUserLogFormValues = {
        id: null,
        name: null,
        userName: null,
        date: null,
        ip: null,
        status: null
    };

    @action setUserLogInfo = (values: IUserLogFormValues) => {
        if (!!values) {
            this.userLogInfo.id = values.id;
            this.userLogInfo.name = values.name;
            this.userLogInfo.userName = values.userName;
            this.userLogInfo.date = values.date;
            this.userLogInfo.ip = values.ip;
            this.userLogInfo.status = values.status;
        }
    }

    @action loadUserLogList = async () => {
        try {
            this.loadingUserLogList = true;
            const res = await agent.UserLog.getUserLogList(this.userLogListValues);
            runInAction(() => {
                const { userLogList, userLogCount } = res;
                this.userLogRegistery.clear();

                if (userLogList && userLogList.length > 0 ) {
                    userLogList.forEach( ( item : IUserLogListItemValues ) => {
                        this.userLogRegistery.set( item.key, item );
                    } )
                }

                if (typeof userLogCount == "number" ) {
                    this.userLogCount = userLogCount;
                }

                this.loadingUserLogList = false;

            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingUserLogList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    }

    @action loadUserLog = async (id:string) => {
        try {
            this.loadingUserLog = true;
            const res = await agent.UserLog.getUserLog(id);
            runInAction(() => {
                this.setUserLogInfo({...res});
                this.loadingUserLog = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingUserLog = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @computed get userLogList() {
        return Array.from(this.userLogRegistery.values());
    }
}
