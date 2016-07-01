import { provideRouter, RouterConfig } from '@angular/router';

import {MainLayout} from "./layout/main-layout/main-layout.component";
import {SignInLayout} from "./layout/sign-in-layout/sign-in-layout.component";
import {PlaylistLayout} from "./layout/playlist-layout/playlist-layout.component";

export const routes:RouterConfig = [
  {path: '', component: MainLayout},
  {path: 'sign-in', component: SignInLayout},
  {path: 'playlist/:id', component: PlaylistLayout}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
