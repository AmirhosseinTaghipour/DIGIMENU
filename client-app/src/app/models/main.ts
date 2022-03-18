export interface IMainMenu {
  resourceid: string;
  resourcename: string;
  resourcecode: string;
  resourcetype: number;
  parentid: string;
  url: string;
  encrypted: number;
  // Insertdate: Date;
  // Insertuser: string;
  // Updatedate: Date;
  // Updateuser: string;
  // Relatedresourceid: string;
  // Rankorder: number;
  id: number;
  isactive: number;
  // Project: string;
  newuntil: string;
  description: string;
  url2: string;
  // ProjectFdo: boolean;
  // ProjectAtomic: boolean;
  // ProjectLimscloud: boolean;
}

export class MainMenu implements IMainMenu {
  resourceid: string = "";
  resourcename: string = "";
  resourcecode: string = "";
  resourcetype: number = 0;
  parentid: string = "";
  url: string = "";
  encrypted: number = 0;
  id: number = 0;
  isactive: number = 0;
  newuntil: string = "";
  description: string = "";
  url2: string = "";
}

export interface ITab {
  id: string;
  title: JSX.Element | string;
  content: JSX.Element | string;
  key: string;
  closable: boolean;
}
