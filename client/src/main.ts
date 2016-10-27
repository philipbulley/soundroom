// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// The app module
import { SoundroomModule } from './soundroom/soundroom.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(SoundroomModule);
