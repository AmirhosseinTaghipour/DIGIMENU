import { observable, action, runInAction, makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { ICategoryFormValues } from "../models/category";
import { RootStore } from "./rootStore";

export default class CategoryStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable sumbittingCategory = false;
    @observable loadingCategory = false;
    


    @observable categoryInfo: ICategoryFormValues = {
        Id: null,
        title: null,
        order: null,
        iconId:null,
        isUpdateMode: false
    };

    @action setCategoryInfo = (values: ICategoryFormValues) => {
        if (!!values) {
            this.categoryInfo.Id = values.Id;
            this.categoryInfo.title = values.title;
            this.categoryInfo.order = values.order;
            this.categoryInfo.iconId = values.iconId;
            this.categoryInfo.isUpdateMode = values.isUpdateMode;
        }
    }

    @action loadCategory = async () => {
        // try {
        //     this.loadingMenu = true;
        //     const res = await agent.Menu.getMenuInfo();
        //     runInAction(() => {
        //         this.menuInfo = res;
        //         this.loadingMenu = false;
        //     });
        // } catch (err: any) {
        //     runInAction(() => {
        //         this.loadingMenu = false;
        //         openNotification(
        //             "error",
        //             "خطا",
        //             `${err?.response?.data?.Message!}`,
        //             "topRight");
        //         throw err;
        //     });
        // }
    };

    @action insertCategory = async (values: ICategoryFormValues) => {
        try {
            this.sumbittingCategory = true;
            const res = await agent.Category.insertCategory(values);
            runInAction(() => {
                this.categoryInfo.isUpdateMode = false;
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingCategory = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingCategory = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action updateCategory = async (values: ICategoryFormValues) => {
        try {
            this.sumbittingCategory = true;
            const res = await agent.Category.updateCategory(values);
            runInAction(() => {
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingCategory = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingCategory = false;
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
