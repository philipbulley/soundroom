import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../shared/service/socket.service';
import { NetworkService } from '../shared/service/network.service';
import { AppToolbarComponent } from './app-toolbar/app-toolbar-layout.component';
import { SpotifyService } from '../shared/service/spotify.service';
import { PlaylistSocketEventService } from '../shared/service/playlist-socket-event.service';
import { SharedModule } from '../shared/shared.module';
import { NoAuthGuard } from './routing/no-auth.guard';
import { AuthGuard } from './routing/auth.guard';

/**
 * CoreModule
 *
 * https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-module
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    AppToolbarComponent,
  ],
  declarations: [
    AppToolbarComponent,
  ],
  providers: [
    NetworkService,
    SocketService,
    PlaylistSocketEventService,
    SpotifyService,
    AuthGuard,
    NoAuthGuard,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
