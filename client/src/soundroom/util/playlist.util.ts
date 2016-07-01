import {Playlist} from "../model/playlist";

export function getPlaylistById( id:string, playlists:Playlist[] ) {
  playlists = playlists.filter(( playlist:Playlist ) => {
    return playlist._id === id;
  });

  return playlists.length > 0
    ? playlists[0]
    : null;
}

export function getPlaylistsWithoutId( id:string, playlists:Playlist[] ) {
  return playlists.filter(( playlist:Playlist ) => id !== playlist._id);
}
