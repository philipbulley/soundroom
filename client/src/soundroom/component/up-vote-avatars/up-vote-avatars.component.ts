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

  @Input()
  private upVotes:UpVote[];

  constructor() {

  }

  ngOnInit() {
    console.log('ngOnInit.upVotes:', this.upVotes);
  }

  ngOnChanges() {
    console.log('ngOnChanges.upVotes:', this.upVotes);
  }
}
