import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { refreshTokenInterceptor } from './interceptors/refreshToken/refresh-token.interceptor';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';

const config: SocketIoConfig = { url: environment.socketBackendUrl, options: {transports: ['websocket', 'polling']} };

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([refreshTokenInterceptor])), 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom(SocketIoModule.forRoot(config))
  ]
};
