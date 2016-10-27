import { NgModule } from '@angular/core';
import { PlaylistLayoutRoutingModule } from './playlist-layout-routing.module';
import { PlaylistLayoutComponent } from './playlist-layout.component';
import { SharedModule } from '../shared/shared.module';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { TrackSearchComponent } from './track-search/track-search.component';
import { PlaylistQueueComponent } from './playlist-queue/playlist-queue.component';
import { DropUrlComponent } from './drop-url/drop-url.component';
import { TimelineComponent } from './timeline/timeline.component';
import { UpVoteAvatarsComponent } from './up-vote-avatars/up-vote-avatars.component';

@NgModule({
	imports: [
	  SharedModule,
    PlaylistLayoutRoutingModule,
  ],
	declarations: [
		PlaylistLayoutComponent,
    NowPlayingComponent,
    TrackSearchComponent,
    PlaylistQueueComponent,
    DropUrlComponent,
    TimelineComponent,
    UpVoteAvatarsComponent,
	],
})
export class PlaylistLayoutModule {
}
