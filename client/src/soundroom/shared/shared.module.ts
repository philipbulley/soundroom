import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AlertifyComponent } from './alertify/alertify.component';
import { CountPipe } from './pipe/count.pipe';
import { ArtistsNamesPipe } from './pipe/artists-names.pipe';
import { MomentPipe } from './pipe/moment.pipe';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const EXPORTED_DECLARATIONS = [
  AlertifyComponent,
  CountPipe,
  ArtistsNamesPipe,
  MomentPipe,
];

/**
 * SharedModule
 *
 * https://angular.io/docs/ts/latest/guide/ngmodule.html#!#shared-module
 *
 * Do not specify app-wide singleton `providers` in a shared module as lazy loaded module that imports that shared
 * module will make its own copy of the service.
 */
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    RouterModule,
    BrowserModule,
  ],
  declarations: [
    ...EXPORTED_DECLARATIONS,
  ],
  exports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    ...EXPORTED_DECLARATIONS,
  ],
})
export class SharedModule {
}
