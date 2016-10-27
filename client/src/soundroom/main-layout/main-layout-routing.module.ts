import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { AuthGuard } from '../core/routing/auth.guard';
import { SharedModule } from '../shared/shared.module';

const ROUTES: Routes = [
	{
		path: 'rooms',
		component: MainLayoutComponent,
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
export class MainLayoutRoutingModule {}
