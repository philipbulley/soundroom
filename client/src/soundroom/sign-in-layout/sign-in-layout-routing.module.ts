import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInLayoutComponent } from './sign-in-layout.component';
import { NoAuthGuard } from '../core/routing/no-auth.guard';
import { SharedModule } from '../shared/shared.module';

export const ROUTES: Routes = [
  {
    path: 'sign-in',
    component: SignInLayoutComponent,
    canActivate: [NoAuthGuard],
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES),
  ],
  exports: [RouterModule],
})
export class SignInLayoutRoutingModule {
}
