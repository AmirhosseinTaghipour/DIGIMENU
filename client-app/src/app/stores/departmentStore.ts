import { observable, computed, action, runInAction, makeAutoObservable, values } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { IFile } from "../models/common";
import { IDepartmentFormValues } from "../models/department";
import { RootStore } from "./rootStore";

export default class DepartmentStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable submittingDepartment = false;
    @observable loadingDepartment = false;

    @observable imageInfo: IFile = {
        file: null,
        name: null,
        url: null,
        isChanged: false,
    };

    @action setImageInfo = (values: IFile) => {
        if (!!values) {
            this.imageInfo.file = values.file;
            this.imageInfo.name = values.name;
            this.imageInfo.url = values.url;
            this.imageInfo.isChanged = values.isChanged;
        }
    };

    @observable logoInfo: IFile = {
        file: null,
        name: null,
        url: null,
        isChanged: false,
    };

    @action setLogoInfo = (values: IFile) => {
        if (!!values) {
            this.logoInfo.file = values.file;
            this.logoInfo.name = values.name;
            this.logoInfo.url = values.url;
            this.logoInfo.isChanged = values.isChanged;
        }
    };

    @observable departmentInfo: IDepartmentFormValues = {
        Id: null,
        title: null,
        description: null,
        postalCode: null,
        address: null,
        phone: null,
        xpos: null,
        ypos: null,
        image: this.imageInfo,
        logo: this.logoInfo,
        isUpdateMode: false
    };
    @action setDepartmentInfo = (values: IDepartmentFormValues) => {
        if (!!values) {
            this.departmentInfo.Id = values.Id;
            this.departmentInfo.title = values.title;
            this.departmentInfo.description = values.description;
            this.departmentInfo.postalCode = values.postalCode;
            this.departmentInfo.address = values.address;
            this.departmentInfo.phone = values.phone;
            this.departmentInfo.xpos = values.xpos;
            this.departmentInfo.ypos = values.ypos;
            this.departmentInfo.image = values.image;
            this.departmentInfo.logo = values.logo;
            this.departmentInfo.isUpdateMode = values.isUpdateMode;
        }
    }
    @action loadDepartment = async () => {
        try {
            this.loadingDepartment = true;
            const res = await agent.Department.getDepartmentInfo();
            const { image, logo } = res;
            runInAction(() => {
                this.imageInfo = image;
                this.logoInfo = logo;
                this.departmentInfo = res;
                this.loadingDepartment = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingDepartment = false;
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
            this.submittingDepartment = true;
            const res = await agent.Department.insertDepartmentInfo(values);
            runInAction(() => {
                this.departmentInfo.isUpdateMode = false;
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.submittingDepartment = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.submittingDepartment = false;
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
            this.submittingDepartment = true;
            const res = await agent.Department.updateDepartmentInfo(values);
            runInAction(() => {
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.submittingDepartment = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.submittingDepartment = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    /* department combobox list */
    @observable loadingDepartmentComboBoxList = false;
    @observable departmentComboBoxRegistery = new Map();

    @action loadDepartmentComboBoxList = async () => {
        try {
            this.loadingDepartmentComboBoxList = true;
            const res = await agent.Department.getDepartmentList()
            runInAction(() => {
                this.departmentComboBoxRegistery.clear();
                res.forEach((department) => {
                    this.departmentComboBoxRegistery.set(department.key, department);
                })
                this.loadingDepartmentComboBoxList = false;
            })
        } catch (err: any) {
            runInAction(() => {
                this.loadingDepartmentComboBoxList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    }

    @computed get departmentComboBoxList() {
        return Array.from(this.departmentComboBoxRegistery.values());
    }
}
