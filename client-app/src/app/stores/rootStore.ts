import UserStore from "./userStore";
import { createContext } from "react";
import { configure } from "mobx";
import CommonStore from "./commonStore";
import MainStore from "./mainStore";



configure( { enforceActions: "always" } );

export class RootStore {
    userStore : UserStore;
    commonStore : CommonStore;
    mainStore : MainStore;
    


    constructor () {
        this.userStore = new UserStore( this );
        this.commonStore = new CommonStore( this );
        this.mainStore = new MainStore( this );
    }
}

export const RootStoreContext = createContext( new RootStore() );
