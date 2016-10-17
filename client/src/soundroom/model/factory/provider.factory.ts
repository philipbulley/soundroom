import {ProviderEnum} from "../enum/provider.enum";

export class ProviderFactory {

  private static dict = {
    'spotify': ProviderEnum.SPOTIFY,
  };

  static getByString( apiData:string ):ProviderEnum {

    return this.dict[apiData];

  }

}
