export interface PlaylistProgressSocketEvent {

  playlistId:string;

  playlistTrackId:string;

  trackId:string;

  currentTime:number;

  duration:number;

  progress:number;

}
