import { RootStore } from "./rootStore";
import { observable, action, runInAction, makeAutoObservable } from "mobx";
import { AddCookie, GetCookie, RemoveCookie } from "../common/util/util";

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this)
  }

  @observable token: string | null = GetCookie("bstoken");
  @observable refreshToken: string | null = GetCookie("bsreftoken");
  @observable appLoaded = false;

  @action setToken = (token: string | null) => {
    runInAction(() => {
      if (token)
        AddCookie("bstoken", token)
      else
        RemoveCookie("bstoken")
    })
  };

  @action setRefToken = (refreshToken: string | null) => {
    runInAction(() => {
      if (refreshToken)
        AddCookie("bsreftoken", refreshToken)
      else
        RemoveCookie("bsreftoken")
    })
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
}
