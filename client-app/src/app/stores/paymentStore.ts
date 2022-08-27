import { observable, computed, action, runInAction, makeAutoObservable, values } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { IPaymentFormValues, IPaymentListItemValues, IPaymentListSearchParam } from "../models/payment";
import { RootStore } from "./rootStore";

export default class PaymentStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable loadingPaymentList = false;
    @observable submittingPayment = false;
    @observable paymentCount = 0;
    @observable paymentRegistery = new Map();

    @observable paymentListValues: IPaymentListSearchParam = {
        title: null,
        entityId: null,
        pId: null,
        sortColumn: null,
        sortDirection: null,
        limit: 10,
        page: 1,
    };

    @action setPaymentListValues = async (values: IPaymentListSearchParam) => {
        if (!!values) {
            this.paymentListValues.title = values.title;
            this.paymentListValues.entityId = values.entityId;
            this.paymentListValues.sortColumn = values.sortColumn;
            this.paymentListValues.sortDirection = values.sortDirection;
            this.paymentListValues.limit = values.limit;
            this.paymentListValues.page = values.page;
        }
    };

    @observable paymentInfo: IPaymentFormValues = {
        id: null,
        type: null,
        isUpdateMode: false
    };

    @action setPaymentInfo = (values: IPaymentFormValues) => {
        if (!!values) {
            this.paymentInfo.id = values.id;
            this.paymentInfo.type = values.type;
            this.paymentInfo.isUpdateMode = values.isUpdateMode;
        }
    }

    @action loadPaymentList = async () => {
        try {
            this.loadingPaymentList = true;
            const res = await agent.Payment.getPaymentList(this.paymentListValues);
            runInAction(() => {
                const { paymentList, paymentCount } = res;
                this.paymentRegistery.clear();

                if (paymentList && paymentList.length > 0 ) {
                    paymentList.forEach( ( item : IPaymentListItemValues ) => {
                        this.paymentRegistery.set( item.key, item );
                    } )
                }

                if (typeof paymentCount == "number" ) {
                    this.paymentCount = paymentCount;
                }

                this.loadingPaymentList = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingPaymentList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    }

    @action insertCategoryItem = async (values: IPaymentFormValues) => {
        try {
            this.submittingPayment = true;
            const res = await agent.Payment.insertPayment(values);
            runInAction(() => {
                this.paymentInfo.isUpdateMode = true;
                this.loadPaymentList();
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.submittingPayment = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.submittingPayment = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action updateCategoryItem = async (values: IPaymentFormValues) => {
        try {
            this.submittingPayment = true;
            const res = await agent.Payment.updatePayment(values);
            runInAction(() => {
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.loadPaymentList();
                this.submittingPayment = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.submittingPayment = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @computed get paymentList() {
        return Array.from(this.paymentRegistery.values());
    }
}
