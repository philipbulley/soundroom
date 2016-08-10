import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {UpVote} from "../../model/up-vote";
import {MomentPipe} from "../../pipe/moment.pipe";

@Component({
  selector: 'up-vote-avatars',
  template: require('./up-vote-avatars.html'),
  styles: [require('./up-vote-avatars.scss')],
  pipes: [MomentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpVoteAvatarsComponent {

  /* tslint:disable:no-unused-variable */
  @Input()
  private upVotes:UpVote[];
  /* tslint:enable:no-unused-variable */

}
