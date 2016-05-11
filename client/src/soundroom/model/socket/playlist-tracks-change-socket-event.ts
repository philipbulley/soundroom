import {PlaylistSocketEvent} from "./playlist-socket-event";
import {PlaylistTrack} from "../playlist-track";
import {PlaylistTracksChangeActionEnum} from "./playlist-tracks-change-action.enum";

export interface PlaylistTracksChangeSocketEvent {

  /**
   * Reason for this change update
   */
  action:PlaylistTracksChangeActionEnum;

  /**
   * The ID of the affected playlist
   */
  playlistId:string;

  /**
   * The PlaylistTrack the action has been performed upon
   */
  playlistTrack:PlaylistTrack;

  /**
   * Array of PlaylistTrack IDs in the correctly sorted order
   */
  playlistTrackIds:string[];

}
