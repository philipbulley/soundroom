import { User } from './user/user';

/**
 * Represents an UpVote as created by a User
 */
export interface UpVote {
  _id: string;
  createdBy: User;
  created: Date;
  modified: Date;
}
