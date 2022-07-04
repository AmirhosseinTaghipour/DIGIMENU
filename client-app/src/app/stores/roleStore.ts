import { observable, computed, action, runInAction, makeAutoObservable, values } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { RootStore } from "./rootStore";

export default class RoleStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    /* Role combobox list */
    @observable loadingRoleComboBoxList = false;
    @observable roleComboBoxRegistery = new Map();

    @action loadRoleComboBoxList = async () => {
        try {
            this.loadingRoleComboBoxList = true;
            const res = await agent.Role.getRoleList()
            runInAction(() => {
                this.roleComboBoxRegistery.clear();
                res.forEach((role) => {
                    this.roleComboBoxRegistery.set(role.key, role);
                })
                this.loadingRoleComboBoxList = false;
            })
        } catch (err: any) {
            runInAction(() => {
                this.loadingRoleComboBoxList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    }

    @computed get roleComboBoxList() {
        return Array.from(this.roleComboBoxRegistery.values());
    }
}
