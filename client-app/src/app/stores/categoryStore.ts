import { observable, action, runInAction, makeAutoObservable, computed } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { ICategoryFormValues, ICategoryListItemValues, ICategoryListOreder, ICategoryListSearchParam } from "../models/category";
import { RootStore } from "./rootStore";

export default class CategoryStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable sumbittingCategory = false;
    @observable loadingCategory = false;
    @observable loadingCategoryList = false;
    @observable deletingCategory = false;
    @observable categoryListRegistery = new Map();
    @observable categoryCount = 0;
    @observable categoryListValues: ICategoryListSearchParam = {
        title: null,
        sortColumn: null,
        sortDirection: null,
        limit: 10,
        page: 1
    };

    @action setCategoryListValues = (values: ICategoryListSearchParam) => {
        if (!!values) {
            this.categoryListValues.title = values.title;
            this.categoryListValues.sortColumn = values.sortColumn;
            this.categoryListValues.sortDirection = values.sortDirection;
            this.categoryListValues.limit = values.limit;
            this.categoryListValues.page = values.page;
        }
    };



    @observable categoryInfo: ICategoryFormValues = {
        id: null,
        title: null,
        iconId: null,
        isUpdateMode: false
    };

    @action setCategoryInfo = (values: ICategoryFormValues) => {
        if (!!values) {
            this.categoryInfo.id = values.id;
            this.categoryInfo.title = values.title;
            this.categoryInfo.iconId = values.iconId;
            this.categoryInfo.isUpdateMode = values.isUpdateMode;
        }
    }

    @action loadCategory = async (id: string) => {
        try {
            this.loadingCategory = true;
            const res = await agent.Category.getCategory(id);
            runInAction(() => {
                this.setCategoryInfo({ ...res });
                this.loadingCategory = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingCategory = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action loadCategoryList = async () => {
        try {
            this.loadingCategoryList = true;

            const res = await agent.Category.getCategoryList(this.categoryListValues);
            runInAction(() => {
                const { categoryList, categoryCount } = res;
                this.categoryListRegistery.clear();

                if (categoryList && categoryList.length > 0) {
                    categoryList.forEach((item: ICategoryListItemValues) => {
                        this.categoryListRegistery.set(item.key, item);
                    })
                }

                if (typeof categoryCount == "number") {
                    this.categoryCount = categoryCount;
                }
                this.loadingCategoryList = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingCategoryList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action insertCategory = async (values: ICategoryFormValues) => {
        try {
            this.sumbittingCategory = true;
            const res = await agent.Category.insertCategory(values);
            runInAction(() => {
                this.categoryInfo.isUpdateMode = false;
                this.loadCategoryList();
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
                this.loadCategoryList();
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

    @action deleteCategory = async (ids: string[]) => {
        try {
            this.deletingCategory = true;
            const res = await agent.Category.deleteCategory(ids);
            runInAction(() => {
                openNotification(
                    "success",
                    "حذف",
                    `${res?.message!}`,
                    "topRight");
                this.deletingCategory = false;
                this.loadCategoryList();
            });
        } catch (err: any) {
            runInAction(() => {
                this.deletingCategory = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action setCategoryListOrder = async (id: string, movement: number) => {
        try {
            let requestParam: ICategoryListOreder = {
                id: id,
                movement: movement,
                limit: this.categoryListValues.limit,
                page: this.categoryListValues.page
            }
            this.loadingCategoryList = true;
            const res = await agent.Category.setCategoryListOrder(requestParam);
            runInAction(() => {
                const { categoryList, categoryCount } = res;
                this.categoryListRegistery.clear();

                if (categoryList && categoryList.length > 0) {
                    categoryList.forEach((item: ICategoryListItemValues) => {
                        this.categoryListRegistery.set(item.key, item);
                    })
                }

                if (typeof categoryCount == "number") {
                    this.categoryCount = categoryCount;
                }
                this.loadingCategoryList = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingCategoryList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @computed get categoryList() {
        return Array.from(this.categoryListRegistery.values());
    }
}
