import _ from 'lodash';
// import socketService from './../service/SocketService';
import spotifyService from './../service/SpotifyService';


// TODO: is it better to go through the socket for search?
// TODO: allow for other providers

class SearchController {

  constructor () {

    // socketService.on('pause', this.pause);
    // socketService.on('resume', this.resume);

  }

  /**
   * Search for tracks
   *
   * @param terms
   * @returns {Q.Promise<Object>}
   */
  search (terms) {
    return spotifyService.search(terms)
      .then((result) => {
        if (!result.numTracks) {
          return [];
        }
        const tracks = [];
        for (let i = 0; i < result.numTracks; i++) {
          const track = result.getTrack(i);

          const link = track.link;
          const title = track.name;
          const album = track.album.link;
          const artist = track.artists.reduce((val, nth) => {
            return val ? `${val}, ${nth.name}` : nth.name;
          }, '');

          tracks.push({
            artist,
            title,
            link,
            album
          });
        }
        return _.uniq(tracks, (n) => n.artist + n.title);
      });
  }
}

export default SearchController;
