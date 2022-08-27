import UserStore from "./userStore";
import { createContext } from "react";
import { configure } from "mobx";
import CommonStore from "./commonStore";
import MainStore from "./mainStore";
import DepartmentStore from "./departmentStore";
import MenuStore from "./menuStore";
import CategoryStore from "./categoryStore";
import CategoryIconStore from "./categoryIconStore";
import CategoryItemStore from "./categoryItemStore";
import FileStore from "./fileStore";
import RoleStore from "./roleStore";
import UserLogStore from "./userLogStore";
import SMSLogStore from "./smsLogStore";
import PaymentStore from "./paymentStore";



configure({ enforceActions: "always" });

export class RootStore {
    userStore: UserStore;
    commonStore: CommonStore;
    mainStore: MainStore;
    departmentStore: DepartmentStore;
    menuStore: MenuStore;
    categoryStore: CategoryStore;
    categoryIconStore: CategoryIconStore;
    categoryItemStore: CategoryItemStore;
    fileStore: FileStore;
    roleStore: RoleStore;
    smsLogStore: SMSLogStore;
    userLogStroe: UserLogStore;
    paymentStore: PaymentStore;



    constructor() {
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.mainStore = new MainStore(this);
        this.departmentStore = new DepartmentStore(this);
        this.menuStore = new MenuStore(this);
        this.categoryStore = new CategoryStore(this);
        this.categoryIconStore = new CategoryIconStore(this);
        this.categoryItemStore = new CategoryItemStore(this);
        this.fileStore = new FileStore(this);
        this.roleStore = new RoleStore(this);
        this.smsLogStore = new SMSLogStore(this);
        this.userLogStroe = new UserLogStore(this);
        this.paymentStore = new PaymentStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());
