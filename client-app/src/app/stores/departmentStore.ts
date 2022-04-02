import { observable, computed, action, runInAction, makeAutoObservable, values } from "mobx";
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
        Id:null,
        title: null,
        description: null,
        postalCode: null,
        address: null,
        phone: null,
        xpos: null,
        ypos: null,
        image: null,
        logo: null,
        isImageChanged:false,
        isLogChanged:false,
        isUpdateMode:false
    };
    @action setDepartmentInfo=(values:IDepartmentFormValues)=>{
        if (!!values){
            this.departmentInfo.Id=values.Id;
            this.departmentInfo.title=values.title;
            this.departmentInfo.description=values.description;
            this.departmentInfo.postalCode=values.postalCode;
            this.departmentInfo.address=values.address;
            this.departmentInfo.phone=values.phone;
            this.departmentInfo.xpos=values.xpos;
            this.departmentInfo.ypos=values.ypos;
            this.departmentInfo.image=values.image;
            this.departmentInfo.logo=values.logo;
            this.departmentInfo.isImageChanged=values.isImageChanged;
            this.departmentInfo.isLogChanged=values.isLogChanged;
            this.departmentInfo.isUpdateMode=values.isUpdateMode;
        }
    }
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

    @action updateDepartment = async (values: IDepartmentFormValues) => {
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
