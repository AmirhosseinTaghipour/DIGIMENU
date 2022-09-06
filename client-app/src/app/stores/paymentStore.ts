import { observable, computed, action, runInAction, makeAutoObservable, values } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { IPaymentFormValues, IPaymentListItemValues, IPaymentListSearchParam, IPaymentResult } from "../models/payment";
import { RootStore } from "./rootStore";

export default class PaymentStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable loadingPaymentList = false;
    @observable submittingPayment = false;
    @observable callingPayment = false;
    @observable checkingPayment = true;
    @observable invalidPayment = false;
    @observable paymentCount = 0;
    @observable paymentRegistery = new Map();

    @observable paymentListValues: IPaymentListSearchParam = {
        departmentId: null,
        statusTitle: null,
        title: null,
        pId: null,
        sortColumn: null,
        sortDirection: null,
        limit: 10,
        page: 1,
        department: null
    };

    @action setPaymentListValues = async (values: IPaymentListSearchParam) => {
        if (!!values) {
            this.paymentListValues.title = values.title;
            this.paymentListValues.departmentId = values.departmentId;
            this.paymentListValues.statusTitle = values.statusTitle;
            this.paymentListValues.pId = values.pId;
            this.paymentListValues.department = values.department;
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

    @observable paymentResultInfo: IPaymentResult = {
        pId: null,
        refId: null,
        pTime: null,
        pDate: null,
        amount: null,
        message: null,
        isPaid: false
    };

    @action setPaymentResultInfo = (values: IPaymentResult) => {
        if (!!values) {
            this.paymentResultInfo.pId = values.pId;
            this.paymentResultInfo.refId = values.refId;
            this.paymentResultInfo.pTime = values.pTime;
            this.paymentResultInfo.pDate = values.pDate;
            this.paymentResultInfo.amount = values.amount;
            this.paymentResultInfo.message = values.message;
            this.paymentResultInfo.isPaid = values.isPaid;

        }
    }

    @action loadPaymentList = async () => {
        try {
            this.loadingPaymentList = true;
            const res = await agent.Payment.getPaymentList(this.paymentListValues);
            runInAction(() => {
                const { paymentList, paymentCount } = res;
                this.paymentRegistery.clear();

                if (paymentList && paymentList.length > 0) {
                    paymentList.forEach((item: IPaymentListItemValues) => {
                        this.paymentRegistery.set(item.key, item);
                    })
                }

                if (typeof paymentCount == "number") {
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

    @action loadUnitPaymentList = async () => {
        try {
            this.loadingPaymentList = true;
            const res = await agent.Payment.getUnitPaymentList(this.paymentListValues);
            runInAction(() => {
                const { paymentList, paymentCount } = res;
                this.paymentRegistery.clear();

                if (paymentList && paymentList.length > 0) {
                    paymentList.forEach((item: IPaymentListItemValues) => {
                        this.paymentRegistery.set(item.key, item);
                    })
                }

                if (typeof paymentCount == "number") {
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

    @action insertPayment = async (values: IPaymentFormValues) => {
        try {
            this.submittingPayment = true;
            const res = await agent.Payment.insertPayment(values);
            runInAction(() => {
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

    @action updatePayment = async (values: IPaymentFormValues) => {
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

    @action payment = async (paymentId: string) => {
        try {
            this.callingPayment = true;
            const res = await agent.Payment.payment(paymentId);
            runInAction(() => {
                openNotification(
                    "success",
                    "درگاه پرداخت",
                    `${res?.message!}`,
                    "topRight");
                setTimeout(() => {
                    this.callingPayment = false;
                    window.history.replaceState(null, "", "/");
                    window.location.replace(res?.data!);
                }, 2000);
            });
        } catch (err: any) {
            runInAction(() => {
                this.callingPayment = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action checkPayment = async (paymentId: string) => {
        try {
            this.checkingPayment = true;
            const res = await agent.Payment.checkPayment(paymentId);
            runInAction(() => {
                this.setPaymentResultInfo({ ...res });
                this.checkingPayment = false
            });
        } catch (err: any) {
            runInAction(() => {
                this.invalidPayment = true;
                this.checkingPayment = false;
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
