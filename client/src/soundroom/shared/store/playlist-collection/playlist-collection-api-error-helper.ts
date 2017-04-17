import { Response } from '@angular/http';
import { Playlist } from '../../model/playlist';
import { PlaylistErrorResult } from '../../model/error/playlist-error-result';
import { PlaylistTrack } from '../../model/playlist-track';
import { PlaylistTrackErrorResult } from '../../model/error/playlist-track-error-result';
import { ErrorResult } from '../../model/error/error-result';
import { ErrorKey } from '../../model/error/error-key';

export function getAddTrackError(response: Response, playlist: Playlist): PlaylistErrorResult {
  const errorJson = response.json();

  const error: PlaylistErrorResult = {
    type: null,
    playlistId: playlist._id,
    status: response.status,
    message: response.statusText,
  };

  if (errorJson.hasOwnProperty('message') && ~errorJson.message.indexOf('getaddrinfo ENOTFOUND')) {
    return Object.assign(error, {type: ErrorKey.PROVIDER_CONNECTION});
  }
  if (errorJson.hasOwnProperty('message') && errorJson.message === 'DUPLICATE_USER_UP_VOTE') {
    return Object.assign(error, {type: ErrorKey.DUPLICATE_USER_UP_VOTE});
  }
  if (response.status === 500) {
    return Object.assign(error, {type: ErrorKey.SERVER});
  }
  return Object.assign(error, {type: ErrorKey.UNKNOWN});
}

export function getDeleteTrackError(response: Response, playlist: Playlist, playlistTrack: PlaylistTrack): PlaylistTrackErrorResult {
  // const errorJson = response.json();

  const error: PlaylistTrackErrorResult = {
    type: null,
    playlist,
    playlistTrack,
    status: response.status,
    message: response.statusText,
  };

  if (response.status === 500) {
    return Object.assign(error, {type: ErrorKey.SERVER});
  }
  return Object.assign(error, {type: ErrorKey.UNKNOWN});
}

export function getCreatePlaylistError(response: Response): ErrorResult {
  // const errorJson = response.json();

  const error: ErrorResult = {
    type: null,
    status: response.status,
    message: response.statusText,
  };

  if (response.status === 500) {
    return Object.assign(error, {type: ErrorKey.SERVER});
  }
  return Object.assign(error, {type: ErrorKey.UNKNOWN});
}
