// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// The app module
import { AppModule } from './soundroom/app.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
