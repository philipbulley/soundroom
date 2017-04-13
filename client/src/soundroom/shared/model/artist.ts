import { ProviderEnum } from "./enum/provider.enum";

export interface Artist {

  _id: string;

  foreignId: string;

  created: Date;

  modified: Date;

  name: string;

  provider: ProviderEnum;

}
