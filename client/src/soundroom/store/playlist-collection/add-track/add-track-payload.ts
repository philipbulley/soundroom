import { Playlist } from '../../../model/playlist';
import { ProviderEnum } from '../../../model/enum/provider.enum';

export interface AddTrackPayload {
  playlist: Playlist;
  provider: ProviderEnum;
  foreignId: string;
}
