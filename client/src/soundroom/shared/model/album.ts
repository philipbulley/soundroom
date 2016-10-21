import {ProviderEnum} from "./enum/provider.enum";

export class Album {

  _id:string;

  foreignId:string;

  created:Date;

  modified:Date;

  name:string;

  provider:ProviderEnum;

}
