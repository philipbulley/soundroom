import {ProviderEnum} from "./enum/provider.enum";
import {Album} from "./album";
import {Artist} from "./artist";
import {User} from "./user";

export class Track {

  _id:string;

  created:Date;

  modified:Date;

  name:string;

  duration:number;

  foreignId:string;

  provider:ProviderEnum;

  album:Album;

  artists:Artist[];

  createdBy:User;

}
