import { observable, action, runInAction, makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { IMenuFormValues } from "../models/menu";
import { RootStore } from "./rootStore";

export default class MenuStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable sumbittingMenu = false;
    @observable loadingMenu = false;


    @observable menuInfo: IMenuFormValues = {
        Id: null,
        title: null,
        description: null,
        isUpdateMode: false
    };
    @action setMenuInfo = (values: IMenuFormValues) => {
        if (!!values) {
            this.menuInfo.Id = values.Id;
            this.menuInfo.title = values.title;
            this.menuInfo.description = values.description;
            this.menuInfo.isUpdateMode = values.isUpdateMode;
        }
    }

    @action loadMenu = async () => {
        try {
            this.loadingMenu = true;
            const res = await agent.Menu.getMenuInfo();
            runInAction(() => {
                this.menuInfo = res;
                this.loadingMenu = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingMenu = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action insertMenu = async (values: IMenuFormValues) => {
        try {
            this.sumbittingMenu = true;
            const res = await agent.Menu.insertMenu(values);
            runInAction(() => {
                this.menuInfo.isUpdateMode = false;
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingMenu = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingMenu = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action updateMenu = async (values: IMenuFormValues) => {
        try {
            this.sumbittingMenu = true;
            const res = await agent.Menu.updateMenu(values);
            runInAction(() => {
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingMenu = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingMenu = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

}
