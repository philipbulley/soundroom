import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {UpVote} from "../../shared/model/up-vote";

@Component({
  selector: 'up-vote-avatars',
  template: require('./up-vote-avatars.html'),
  styles: [require('./up-vote-avatars.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpVoteAvatarsComponent {

  /* tslint:disable:no-unused-variable */
  @Input()
  private upVotes:UpVote[];
  /* tslint:enable:no-unused-variable */

}
