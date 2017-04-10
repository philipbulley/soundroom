import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const APP_ROUTES: Routes = [
  {
    // default route
    path: '',
    redirectTo: '/rooms',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, {useHash: false})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
