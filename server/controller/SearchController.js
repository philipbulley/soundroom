import _ from 'lodash';
import spotifyService from './../service/SpotifyService';

/**
 * Search for tracks
 *
 * @param terms
 * @returns {Q.Promise<Object>}
 */
const search = (terms) => {
  return spotifyService.search(terms)
    .then((result) => {

      const {items} = result.tracks;

      if (!items.length) {
        return [];
      }

      const tracks = items.map((track) => {
        const {id, name, artists} = track;
        const artist = artists.reduce((val, nth) => {
          return val ? `${val}, ${nth.name}` : nth.name;
        }, '');

        return {
          id,
          name,
          artist
        };
      });

      return _.uniq(tracks, (n) => n.artist + n.title);
    })
    .catch((err) => console.log(err));
};

export default {search};
