import { Playlist } from '../../../model/playlist';
import { ProviderEnum } from '../../../model/enum/provider.enum';

export interface AddTrackPayload {
  /** The `Playlist` being added to. */
  playlist: Playlist;

  /** The provider of the track. */
  provider: ProviderEnum;

  /** The ID of the track according to the provider. */
  foreignId: string;
}
