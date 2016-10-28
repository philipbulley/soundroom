import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistLayoutComponent } from './playlist-layout.component';
import { AuthGuard } from '../core/routing/auth.guard';
import { SharedModule } from '../shared/shared.module';

const ROUTES: Routes = [
	{
    path: 'room/:id',
		component: PlaylistLayoutComponent,
    canActivate: [AuthGuard],
	},
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES),
  ],
  exports: [ RouterModule ],
})
export class PlaylistLayoutRoutingModule {}
