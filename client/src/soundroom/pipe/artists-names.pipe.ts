import {Pipe, PipeTransform} from 'angular2/core';
import {Artist} from "../model/artist";

@Pipe({
  name: 'artistsNames'
})
export class ArtistsNamesPipe implements PipeTransform {

  transform( artists:Artist[] ):string {
    if (!artists) {
      return '';
    }

    const names = artists.map(( artist:Artist ) => {
      return artist.name;
    });

    return names.join(', ');
  }

}
