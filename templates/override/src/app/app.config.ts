import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { appRoutes } from './app.routes';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FLUIG_URL_CONFIG } from './fluig-variables-config';
import { provideAnimations } from '@angular/platform-browser/animations';

registerLocaleData(ptBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: APP_BASE_HREF, useValue: FLUIG_URL_CONFIG.APP_BASE || '/' }
  ]
};