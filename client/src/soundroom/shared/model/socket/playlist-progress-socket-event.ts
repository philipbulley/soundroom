import {PlaylistSocketEvent} from "./playlist-socket-event";

export interface PlaylistProgressSocketEvent extends PlaylistSocketEvent {

  currentTime:number;

  duration:number;

  progress:number;

}
