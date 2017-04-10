import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { STORE_REDUCERS } from './shared/store/store.reducers';
import { STORE_EFFECTS } from './shared/store/store.effects';
import { PlaylistLayoutModule } from './playlist-layout/playlist-layout.module';
import { MainLayoutModule } from './main-layout/main-layout.module';
import { SignInLayoutModule } from './sign-in-layout/sign-in-layout.module';
import { SharedModule } from './shared/shared.module';

/* Feature Modules */
@NgModule({
  bootstrap: [AppComponent],
  imports: [
    CoreModule,
    SharedModule,
    StoreModule.provideStore(STORE_REDUCERS),
    STORE_EFFECTS,
    AppRoutingModule,
    // Non lazy-loaded modules
    MainLayoutModule,
    PlaylistLayoutModule,
    SignInLayoutModule,
  ],
  declarations: [
    AppComponent,
  ],
})
export class AppModule {
}
