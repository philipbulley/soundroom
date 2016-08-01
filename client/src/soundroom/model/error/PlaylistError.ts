import {AbstractError} from "./AbstractError";
import {Playlist} from "../playlist";

export class PlaylistError extends AbstractError {

  /** When we can't connect to the provider  */
  static PROVIDER_CONNECTION = 'PlaylistError.PROVIDER_CONNECTION';

  /** When we can't connect to the provider  */
  static DUPLICATE_USER_UP_VOTE = 'PlaylistError.DUPLICATE_USER_UP_VOTE';

  /** Unspecified server error  */
  static SERVER = 'PlaylistError.SERVER';

  /** Unspecified server error  */
  static UNKNOWN = 'PlaylistError.UNKNOWN';

  constructor( public type:string, devMessage?:any, model?:Playlist, public originalError?:any ) {
    super(type, devMessage, model);
  }

  getFriendlyMessage():string {
    switch (this.type) {
      case PlaylistError.PROVIDER_CONNECTION:
        return `We haven't been able to connect to %provider%.`;
      default:
        return super.getFriendlyMessage();
    }
  }

  toString():string {
    return '[PlaylistError type="' + this.type + '", devMessage="' + this.message + '", model="' + this.model + '", originalError="' + this.originalError + '"]';
  }
}
