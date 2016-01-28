import { exportModuleModel } from './../../util/MongooseUtil';
import createAction from './schema/Action';
import createAlbum from './schema/Album';
import createArtist from './schema/Artist';
import createPlaylist from './schema/Playlist';
import createTrack from './schema/Track';
import createUser from './schema/User';

const db = {};

export function initModels() {
  const appInstance = 'appInstance';

  db.Action = exportModuleModel(appInstance, 'Action', createAction);
  db.Album = exportModuleModel(appInstance, 'Album', createAlbum);
  db.Artist = exportModuleModel(appInstance, 'Artist', createArtist);
  db.Playlist = exportModuleModel(appInstance, 'Playlist', createPlaylist);
  db.Track = exportModuleModel(appInstance, 'Track', createTrack);
  db.User = exportModuleModel(appInstance, 'User', createUser);
}

export default db;
