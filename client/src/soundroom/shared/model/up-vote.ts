import { User } from "./user";

/**
 * Represents an UpVote as created by a User
 */
export class UpVote {

  _id: string;

  createdBy: User;

  created: Date;

  modified: Date;

}
