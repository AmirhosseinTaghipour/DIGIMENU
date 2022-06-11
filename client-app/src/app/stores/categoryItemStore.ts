import { observable, action, runInAction, makeAutoObservable, computed } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { ICategoryFormValues, ICategoryListItemValues, ICategoryListOreder, ICategoryListSearchParam } from "../models/category";
import { ICategoryItemFormValues, ICategoryItemListItemValues, ICategoryItemListOreder, ICategoryItemListSearchParam } from "../models/categoryItem";
import { RootStore } from "./rootStore";

export default class CategoryItemStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable sumbittingCategoryItem = false;
    @observable loadingCategoryItem = false;
    @observable loadingCategoryItemList = false;
    @observable deletingCategoryItem = false;
    @observable categoryItemListRegistery = new Map();
    @observable categoryItemCount = 0;
    @observable categoryItemListValues: ICategoryItemListSearchParam = {
        title: null,
        categoryTitle: null,
        categoryId: null,
        sortColumn: null,
        sortDirection: null,
        limit: 10,
        page: 1,
    };

    @action setCategoryItemListValues = (values: ICategoryItemListSearchParam) => {
        if (!!values) {
            this.categoryItemListValues.title = values.title;
            this.categoryItemListValues.categoryTitle = values.categoryTitle;
            this.categoryItemListValues.categoryId = values.categoryId;
            this.categoryItemListValues.sortColumn = values.sortColumn;
            this.categoryItemListValues.sortDirection = values.sortDirection;
            this.categoryItemListValues.limit = values.limit;
            this.categoryItemListValues.page = values.page;
        }
    };



    @observable categoryItemInfo: ICategoryItemFormValues = {
        id: null,
        title: null,
        categoryId: null,
        price: null,
        discount: null,
        discountType: null,
        description: null,
        useDiscount: false,
        isExist: true,
        isUpdateMode: false,
    };

    @action setCategoryItemInfo = (values: ICategoryItemFormValues) => {
        if (!!values) {
            this.categoryItemInfo.id = values.id;
            this.categoryItemInfo.title = values.title;
            this.categoryItemInfo.categoryId = values.categoryId;
            this.categoryItemInfo.price = values.price;
            this.categoryItemInfo.discount = values.discount;
            this.categoryItemInfo.discountType = values.discountType;
            this.categoryItemInfo.description = values.description;
            this.categoryItemInfo.useDiscount = values.useDiscount;
            this.categoryItemInfo.isExist = values.isExist;
            this.categoryItemInfo.isUpdateMode = values.isUpdateMode;
        }
    }

    @action loadCategoryItem = async (id: string) => {
        try {
            this.loadingCategoryItem = true;
            const res = await agent.CategoryItem.getCategoryItem(id);
            runInAction(() => {
                this.setCategoryItemInfo({ ...res });
                this.loadingCategoryItem = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingCategoryItem = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action loadCategoryItemList = async () => {
        try {
            this.loadingCategoryItemList = true;

            const res = await agent.CategoryItem.getCategoryItemList(this.categoryItemListValues);
            runInAction(() => {
                const { categoryItemList, categoryItemCount } = res;
                this.categoryItemListRegistery.clear();

                if (categoryItemList && categoryItemList.length > 0) {
                    categoryItemList.forEach((item: ICategoryItemListItemValues) => {
                        this.categoryItemListRegistery.set(item.key, item);
                    })
                }

                if (typeof categoryItemCount == "number") {
                    this.categoryItemCount = categoryItemCount;
                }
                this.loadingCategoryItemList = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingCategoryItemList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action insertCategoryItem = async (values: ICategoryItemFormValues) => {
        try {
            this.sumbittingCategoryItem = true;
            const res = await agent.CategoryItem.insertCategoryItem(values);
            runInAction(() => {
                this.categoryItemInfo.isUpdateMode = false;
                this.loadCategoryItemList();
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingCategoryItem = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingCategoryItem = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action updateCategoryItem = async (values: ICategoryItemFormValues) => {
        try {
            this.sumbittingCategoryItem = true;
            const res = await agent.CategoryItem.updateCategoryItem(values);
            runInAction(() => {
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.loadCategoryItemList();
                this.sumbittingCategoryItem = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingCategoryItem = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action deleteCategoryItem = async (ids: string[]) => {
        try {
            this.deletingCategoryItem = true;
            const res = await agent.CategoryItem.deleteCategoryItem(ids);
            runInAction(() => {
                openNotification(
                    "success",
                    "حذف",
                    `${res?.message!}`,
                    "topRight");
                this.deletingCategoryItem = false;
                this.loadCategoryItemList();
            });
        } catch (err: any) {
            runInAction(() => {
                this.deletingCategoryItem = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action setCategoryItemListOrder = async (id: string,  movement: number) => {
        try {
            let requestParam: ICategoryItemListOreder = {
                id: id,
                categoryId: this.categoryItemListValues.categoryId,
                movement: movement,
                limit: this.categoryItemListValues.limit,
                page: this.categoryItemListValues.page,
            }
            
            this.loadingCategoryItemList = true;
            const res = await agent.CategoryItem.setCategoryItemListOrder(requestParam);
            runInAction(() => {
                const { categoryItemList, categoryItemCount } = res;
                this.categoryItemListRegistery.clear();

                if (categoryItemList && categoryItemList.length > 0) {
                    categoryItemList.forEach((item: ICategoryItemListItemValues) => {
                        this.categoryItemListRegistery.set(item.key, item);
                    })
                }

                if (typeof categoryItemCount == "number") {
                    this.categoryItemCount = categoryItemCount;
                }
                this.loadingCategoryItemList = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingCategoryItemList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @computed get categoryItemList() {
        return Array.from(this.categoryItemListRegistery.values());
    }
}
