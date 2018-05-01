import { ErrorResult } from '../../error/error-result';
import { Playlist } from '../../model/playlist';

export interface Playlists {
	items: Playlist[];
	loading: boolean;
	error?: ErrorResult;
	playlistCreate: PlaylistCreate;
}

/**
 * State specific to the playlist creation process
 */
export interface PlaylistCreate {
	loading: boolean;
	/** If a playlist has just been created by this client, this will be the id of said Playlist */
	successfullyCreatedId?: string;
	/** This ID is changes each time PlaylistCreate is reset */
	iterationId: string;
	error?: ErrorResult;
}
