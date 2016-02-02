export interface Playlist {

  /** _id is the MongoDB convention, not intending this to appear as "private" */
  _id: string;

  name: string;

  description: string;

  created: string;

  modified: string;

  tracks: any[];
}
