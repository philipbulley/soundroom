import { UserFactory } from "./user.factory";
import { UpVote } from "../up-vote";

export class UpVoteFactory {

  static createFromApiResponse(apiData: any): UpVote {

    const upVote = new UpVote();

    upVote._id = apiData._id;

    upVote.modified = new Date(apiData.modified);

    upVote.created = new Date(apiData.created);

    upVote.createdBy = UserFactory.createFromApiResponse(apiData.createdBy);

    return upVote;
  }

}
