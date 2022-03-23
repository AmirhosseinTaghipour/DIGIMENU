import { observable, computed, action, runInAction, makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { RootStore } from "./rootStore";

export default class MainStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable appMenuRegistery = new Map();
    @observable loadingAppMenu = false;
    @observable activeMenuCode: string | null = null;

    @action setActiveMenuCode = (menuCode: string | null) => {
        this.activeMenuCode = menuCode;
    }

    @action loadAppMenu = async () => {
        try {
            this.loadingAppMenu = true;
            const res = await agent.Main.getAppMenu();
            runInAction(() => {
                this.appMenuRegistery.clear();
                res.forEach((menu) => {
                    this.appMenuRegistery.set(menu.menuId, menu);
                })
                this.loadingAppMenu = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingAppMenu = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @computed get appMenuList() {
        return Array.from(this.appMenuRegistery.values());
    }
}
