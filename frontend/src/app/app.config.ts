import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { refreshTokenInterceptor } from './interceptors/refreshToken/refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([refreshTokenInterceptor])), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
