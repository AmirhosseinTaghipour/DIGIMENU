import UserStore from "./userStore";
import { createContext } from "react";
import { configure } from "mobx";
import CommonStore from "./commonStore";
import MainStore from "./mainStore";
import DepartmentStore from "./departmentStore";
import MenuStore from "./menuStore";
import CategoryStore from "./categoryStore";



configure( { enforceActions: "always" } );

export class RootStore {
    userStore : UserStore;
    commonStore : CommonStore;
    mainStore : MainStore;
    departmentStore : DepartmentStore;
    menuStore : MenuStore;
    categoryStore : CategoryStore;
    


    constructor () {
        this.userStore = new UserStore( this );
        this.commonStore = new CommonStore( this );
        this.mainStore = new MainStore( this );
        this.departmentStore = new DepartmentStore( this );
        this.menuStore= new MenuStore(this);
        this.categoryStore= new CategoryStore(this);
    }
}

export const RootStoreContext = createContext( new RootStore() );
