import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { SoundroomRoutingModule } from './soundroom-routing.module';
import { CoreModule } from './core/core.module';
import { SoundroomComponent } from './soundroom.component';
import { STORE_REDUCERS } from './shared/store/store.reducers';
import { STORE_EFFECTS } from './shared/store/store.effects';
import { PlaylistLayoutModule } from './playlist-layout/playlist-layout.module';
import { MainLayoutModule } from './main-layout/main-layout.module';
import { SignInLayoutModule } from './sign-in-layout/sign-in-layout.module';
import { SharedModule } from './shared/shared.module';

/* Feature Modules */
@NgModule({
	bootstrap: [SoundroomComponent],
	imports: [
		CoreModule,
    SharedModule,
		StoreModule.provideStore(STORE_REDUCERS),
		STORE_EFFECTS,
    SoundroomRoutingModule,
		// Non lazy-loaded modules
    MainLayoutModule,
    PlaylistLayoutModule,
    SignInLayoutModule,
	],
	declarations: [
		SoundroomComponent,
	],
})
export class SoundroomModule {
}
