import { observable, action, runInAction, makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { ICategoryFormValues } from "../models/category";
import { IFile } from "../models/common";
import { RootStore } from "./rootStore";

export default class CategoryStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable sumbittingCategory = false;
    @observable loadingCategory = false;
    
    @observable iconInfo: IFile = {
        file: null,
        name: null,
        url: null,
        isChanged: false,
    };

    @action setIconInfo = (values: IFile) => {
        if (!!values) {
            this.iconInfo.file = values.file;
            this.iconInfo.name = values.name;
            this.iconInfo.url = values.url;
            this.iconInfo.isChanged = values.isChanged;
        }
    };

    @observable categoryInfo: ICategoryFormValues = {
        Id: null,
        title: null,
        order: null,
        icon:this.iconInfo,
        isUpdateMode: false
    };

    @action setCategoryInfo = (values: ICategoryFormValues) => {
        if (!!values) {
            this.categoryInfo.Id = values.Id;
            this.categoryInfo.title = values.title;
            this.categoryInfo.order = values.order;
            this.categoryInfo.icon = values.icon;
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
