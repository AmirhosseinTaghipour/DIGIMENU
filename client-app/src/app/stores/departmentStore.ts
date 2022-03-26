import { observable, computed, action, runInAction, makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { IDepartmentFormValues } from "../models/department";
import { RootStore } from "./rootStore";

export default class DepartmentStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable insertingDepartment = false;
    @observable loadingDepartment = false;
    @observable departmentInfo: IDepartmentFormValues = {
        title: null,
        description: null,
        postalCode: null,
        address: null,
        phone: null,
        xpos: null,
        ypos: null,
        image: null,
        logo: null
    };
    @action loadDepartment = async () => {
        try {
            this.insertingDepartment = true;
            const res = await agent.Department.getDepartmentInfo();
            runInAction(() => {
                this.departmentInfo = res;
                this.insertingDepartment = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.insertingDepartment = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action insertDepartment = async (values: IDepartmentFormValues) => {
        try {
            this.insertingDepartment = true;
            const res = await agent.Department.insertDepartmentInfo(values);
            runInAction(() => {
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.insertingDepartment = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.insertingDepartment = false;
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
