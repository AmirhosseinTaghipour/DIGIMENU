import UserStore from "./userStore";
import { createContext } from "react";
import { configure } from "mobx";
import CommonStore from "./commonStore";
import MainStore from "./mainStore";
import DepartmentStore from "./departmentStore";
import MenuStore from "./menuStore";



configure( { enforceActions: "always" } );

export class RootStore {
    userStore : UserStore;
    commonStore : CommonStore;
    mainStore : MainStore;
    departmentStore : DepartmentStore;
    menuStore : MenuStore;
    


    constructor () {
        this.userStore = new UserStore( this );
        this.commonStore = new CommonStore( this );
        this.mainStore = new MainStore( this );
        this.departmentStore = new DepartmentStore( this );
        this.menuStore= new MenuStore(this);
    }
}

export const RootStoreContext = createContext( new RootStore() );
