import { map } from "leaflet";
import { observable, action, runInAction, makeAutoObservable, computed } from "mobx";
import agent from "../api/agent";
import { openNotification } from "../common/util/util";
import { IFile } from "../models/common";
import { IFileFormValues, IFileListItemValues, IFileListSearchParam } from "../models/file";
import { RootStore } from "./rootStore";

export default class FileStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this)
    }

    @observable sumbittingFile = false;
    @observable deletingFile = false;
    @observable loadingFile = false;
    @observable loadingFileList = false;
    @observable fileListRegistery = new Map();
    @observable fileCount = 0;
    @observable fileListValues: IFileListSearchParam = {
        entityName: null,
        entityId: null,
        title: null,
        sortColumn: null,
        sortDirection: null,
        limit: 10,
        page: 1
    };

    @action setFileListValues = (values: IFileListSearchParam) => {
        if (!!values) {
            this.fileListValues.entityId = values.entityId;
            this.fileListValues.entityName = values.entityName;
            this.fileListValues.title = values.title;
            this.fileListValues.sortColumn = values.sortColumn;
            this.fileListValues.sortDirection = values.sortDirection;
            this.fileListValues.limit = values.limit;
            this.fileListValues.page = values.page;
        }
    };

    @observable fileInfo: IFile = {
        file: null,
        name: null,
        url: null,
        isChanged: false,
    };

    @action setFileInfo = (values: IFile) => {
        if (!!values) {
            this.fileInfo.file = values.file;
            this.fileInfo.name = values.name;
            this.fileInfo.url = values.url;
            this.fileInfo.isChanged = values.isChanged;
        }
    };

    @observable fileFormInfo: IFileFormValues = {
        id: null,
        title: null,
        entityName: null,
        entityId: null,
        file: this.fileInfo,
        isDefault: false,
        isUpdateMode: false,
    };

    @action setFileFormInfo = (values: IFileFormValues) => {
        if (!!values) {
            this.fileFormInfo.id = values.id;
            this.fileFormInfo.title = values.title;
            this.fileFormInfo.entityName = values.entityName;
            this.fileFormInfo.entityId = values.entityId;
            this.fileFormInfo.file = values.file;
            this.fileFormInfo.isDefault = values.isDefault;
            this.fileFormInfo.isUpdateMode = values.isUpdateMode;
        }
    }

    @action loadFile = async (id:string) => {
        try {
            this.loadingFile = true;
            const res = await agent.File.getFile(id);
            const {file} = res;
            runInAction(() => {
                this.setFileInfo({...file});
                this.setFileFormInfo({...res});
                this.loadingFile = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.loadingFile = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action loadFileList = async () => {
        try {
            this.loadingFileList = true;
            
            const res = await agent.File.getFileList(this.fileListValues);
            runInAction(() => {
                const { fileList, fileCount } = res;
                this.fileListRegistery.clear();

                if (fileList && fileList.length > 0 ) {
                    fileList.forEach( ( item : IFileListItemValues ) => {
                        this.fileListRegistery.set( item.key, item );
                    } )
                }

                if (typeof fileCount == "number" ) {
                    this.fileCount = fileCount;
                }
            });
            this.loadingFileList = false;

        } catch (err: any) {
            runInAction(() => {
                this.loadingFileList = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action insertFile = async (values: IFileFormValues) => {
        try {
            this.sumbittingFile = true;
            const res = await agent.File.insertFile(values);
            runInAction(() => {
                this.fileFormInfo.isUpdateMode = false;
                this.loadFileList();
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingFile = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingFile = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action updateFile = async (values: IFileFormValues) => {
        try {
            this.sumbittingFile = true;
            const res = await agent.File.updateFile(values);
            runInAction(() => {
                this.loadFileList();
                openNotification(
                    "success",
                    "ثبت اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.sumbittingFile = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.sumbittingFile = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    };

    @action deleteFile = async (id: string) => {
        try {
            this.deletingFile = true;
            const res = await agent.File.deleteFile(id);
            runInAction(() => {
                this.loadFileList();
                openNotification("success",
                    "حذف اطلاعات",
                    `${res?.message!}`,
                    "topRight");
                this.deletingFile = false;
            });
        }
        catch (err: any) {
            runInAction(() => {
                this.deletingFile = false;
                openNotification(
                    "error",
                    "خطا",
                    `${err?.response?.data?.Message!}`,
                    "topRight");
                throw err;
            });
        }
    }

    @computed get fileList() {
        return Array.from(this.fileListRegistery.values());
    }
}
