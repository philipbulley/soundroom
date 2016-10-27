import { NgModule } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PlaylistMenuComponent } from './playlist-menu/playlist-menu.component';
import { NowPlayingPreviewComponent } from './now-playing-preview/now-playing-preview.component';
import { PlaylistCreateComponent } from './playlist-create/playlist-create.component';
import { PlaylistMenuItemComponent } from './playlist-menu-item/playlist-menu-item.component';

@NgModule({
	imports: [
	  SharedModule,
    MainLayoutRoutingModule,
  ],
	declarations: [
		MainLayoutComponent,
    PlaylistMenuComponent,
    NowPlayingPreviewComponent,
    PlaylistMenuItemComponent,
    PlaylistCreateComponent,
	],
})
export class MainLayoutModule {
}
