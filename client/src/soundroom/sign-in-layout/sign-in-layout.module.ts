import { NgModule } from '@angular/core';
import { SignInLayoutComponent } from './sign-in-layout.component';
import { SharedModule } from '../shared/shared.module';
import { SocialSignInComponent } from './sign-in/social-sign-in.component';
import { SignInLayoutRoutingModule } from './sign-in-layout-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SignInLayoutRoutingModule,
  ],
  declarations: [
    SignInLayoutComponent,
    SocialSignInComponent,
  ],
})
export class SignInLayoutModule {
}
