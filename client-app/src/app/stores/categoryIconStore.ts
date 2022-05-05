import { map } from "leaflet";
import { observable, action, runInAction, makeAutoObservable, computed } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { ICategoryFormValues } from "../models/category";
import { ICategoryIconFormValues, ICategoryIconListItemValues, ICategoryIconListSearchParam } from "../models/categoryIcon";
import { IFile } from "../models/common";
import { RootStore } from "./rootStore";

export default class CategoryIconStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable sumbittingCategoryIcon = false;
    @observable deletingCategoryIcon = false;
    @observable loadingCategoryIcon = false;
    @observable loadingCategoryIconList = false;
    @observable categoryIconListRegistery = new Map();
    @observable categoryIconCount = 0;
    @observable categoryIconListValues: ICategoryIconListSearchParam = {
        title:  null,
        sortColumn: null,
        sortDirection: null,
        limit:  10,
        page:  1
    };

    @action setCategoryIconListValues = (values: ICategoryIconListSearchParam) => {
        if (!!values) {
            this.categoryIconListValues.title = values.title;
            this.categoryIconListValues.sortColumn = values.sortColumn;
            this.categoryIconListValues.sortDirection = values.sortDirection;
            this.categoryIconListValues.limit = values.limit;
            this.categoryIconListValues.page = values.page;
        }
    };

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

    @observable categoryIconInfo: ICategoryIconFormValues = {
        id: null,
        title: null,
        icon: this.iconInfo,
        isUpdateMode: false
    };

    @action setCategoryIconInfo = (values: ICategoryIconFormValues) => {
        if (!!values) {
            this.categoryIconInfo.id = values.id;
            this.categoryIconInfo.title = values.title;
            this.categoryIconInfo.icon = values.icon;
            this.categoryIconInfo.isUpdateMode = values.isUpdateMode;
        }
    }

    @action loadCategoryIcon = async (id:string) => {
        try {
            this.loadingCategoryIcon = true;
            const res = await agent.CategoryIcon.getCategoryIcon(id);
            const {icon} = res;
            runInAction(() => {
                this.setIconInfo({...icon});
                this.setCategoryIconInfo({...res});
                this.loadingCategoryIcon = false;
                console.log(res.title);
                console.log(this.categoryIconInfo.title);
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingCategoryIcon = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action loadCategoryIconList = async () => {
        try {
            this.loadingCategoryIconList = true;
            
            const res = await agent.CategoryIcon.getCategoryIconList(this.categoryIconListValues);
            runInAction(() => {
                const { categoryIconList, categoryIconCount } = res;
                this.categoryIconListRegistery.clear();

                if (categoryIconList && categoryIconList.length > 0 ) {
                    categoryIconList.forEach( ( item : ICategoryIconListItemValues ) => {
                        this.categoryIconListRegistery.set( item.key, item );
                    } )
                }

                if (typeof categoryIconCount == "number" ) {
                    this.categoryIconCount = categoryIconCount;
                }
                this.loadingCategoryIconList = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingCategoryIconList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action insertCategoryIcon = async (values: ICategoryIconFormValues) => {
        try {
            this.sumbittingCategoryIcon = true;
            const res = await agent.CategoryIcon.insertCategoryIcon(values);
            runInAction(() => {
                this.categoryIconInfo.isUpdateMode = false;
                this.loadCategoryIconList();
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingCategoryIcon = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingCategoryIcon = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action updateCategoryIcon = async (values: ICategoryIconFormValues) => {
        try {
            this.sumbittingCategoryIcon = true;
            const res = await agent.CategoryIcon.updateCategoryIcon(values);
            runInAction(() => {
                this.loadCategoryIconList();
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingCategoryIcon = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingCategoryIcon = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action deleteCategoryIcon = async (id: string) => {
        try {
            this.deletingCategoryIcon = true;
            const res = await agent.CategoryIcon.deleteCategoryIcon(id);
            runInAction(() => {
                this.loadCategoryIconList();
                openNotification("success",
                    "حذف اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.deletingCategoryIcon = false;
            });
        }
        catch (err: any) {
            runInAction(() => {
                this.deletingCategoryIcon = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    }

    @computed get categoryIconList() {
        return Array.from(this.categoryIconListRegistery.values());
    }
}
