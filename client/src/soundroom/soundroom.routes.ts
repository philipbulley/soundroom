import {provideRouter, RouterConfig} from '@angular/router';

import {MainLayout} from "./layout/main-layout/main-layout.component";
import {SignInLayout} from "./layout/sign-in-layout/sign-in-layout.component";
import {PlaylistLayout} from "./layout/playlist-layout/playlist-layout.component";
import {AuthGuard} from "./auth.guard";
import {AuthService} from "./service/auth.service";
import {NoAuthGuard} from "./no-auth.guard";

export const routes:RouterConfig = [
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-in',
    component: SignInLayout,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'playlist/:id',
    component: PlaylistLayout,
    canActivate: [AuthGuard],
  },
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
  AuthGuard,
  NoAuthGuard,
  AuthService,
];
