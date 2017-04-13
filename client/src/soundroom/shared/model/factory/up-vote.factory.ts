import { UserFactory } from "./user.factory";
import { UpVote } from "../up-vote";

export class UpVoteFactory {
  static createFromApiResponse(apiData: any): UpVote {
    const {_id} = apiData;

    return {
      _id,
      modified: new Date(apiData.modified),
      created: new Date(apiData.created),
      createdBy: UserFactory.createFromApiResponse(apiData.createdBy),
    };
  }
}
