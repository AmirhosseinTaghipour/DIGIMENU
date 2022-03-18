import { observable, computed, action, runInAction, makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { IMainMenu, ITab } from "../models/main";

export default class MainStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this)
  }
  @observable MainMenuRegistery = new Map();
  @observable MainMenus: IMainMenu[] = [];
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;
  @observable expanded: number[] = [];
  @observable panes: ITab[] = [];
  @observable activeTabKey: string = "1";
  @observable newTabIndex: number = 0;

  @action loadMenuItems = async () => {
    try {
      this.loadingInitial = true;
      const menuRawData = await agent.Main.getMainMenu();
      runInAction(() => {
        this.MainMenuRegistery.clear();
        menuRawData.forEach((MenuItem) => {
          this.MainMenuRegistery.set(MenuItem.id, MenuItem);
        });
        this.loadingInitial = false;
        this.addNewTabIndex();
        // this.panes.push({ closable: false, id: 'a5d8ba71-16bc-44cd-b806-1ff56e611309', content: 'کارتابل', key: '0', title: 'کارتابل' })
        this.panes.push({
          closable: false,
          id: "b32a1556-d183-409e-9cdb-3f4daa162f96",
          content: "جستجوی پذیرش",
          key: "0",
          title: "جستجوی پذیرش",
        });
        this.setActiveTabKey("0");
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
          console.log("get Main Menu Items Error");
      });
    }
  };


  @action addExpanded = async (input: number) => {
    this.expanded.push(input);
  };

  @action removeExpanded = async (removeItem: number) => {
    this.expanded = this.expanded.filter((item) => item !== removeItem);
  };

  @action addNewTabIndex = async () => {
    this.newTabIndex = this.newTabIndex + 1;
  };

  @action setActiveTabKey = async (key: string) => {
    this.activeTabKey = key;
  };

  @action addPane = async (pane: ITab) => {
    try {
      const tab = this.panes.find((item: ITab) => item.id === pane.id);
      runInAction(() => {
        if (tab) {
          this.activeTabKey = tab.key;
        } else {
          this.panes = [...this.panes, pane];
          this.activeTabKey = pane.key;
        }
      });
    } catch (error) {
      runInAction(() => {
          console.log("add Pane Error");
      });
    }
  };

  @action removePane = async (targetkey: string) => {
    let lastIndex = 0;
    this.panes.forEach((pane, i) => {
      if (pane.key === targetkey) {
        lastIndex = i - 1;
      }
    });
    this.panes = this.panes.filter((pane) => pane.key !== targetkey);
    if (this.panes.length && this.activeTabKey === targetkey) {
      if (lastIndex >= 0) {
        this.activeTabKey = this.panes[lastIndex].key;
      } else {
        this.activeTabKey = this.panes[0].key;
      }
    }
  };

  @computed get mainMenuList() {
    return Array.from(this.MainMenuRegistery.values());
  }
}
