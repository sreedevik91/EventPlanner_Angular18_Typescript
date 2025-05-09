import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { refreshTokenInterceptor } from './interceptors/refreshToken/refresh-token.interceptor';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { UserSrerviceService } from './services/userService/user-srervice.service';
import { catchError, firstValueFrom, of } from 'rxjs';

const config: SocketIoConfig = { url: environment.socketBackendUrl, options: {transports: ['websocket', 'polling']} };

// export function initializeApp(userService: UserSrerviceService) {

//   return () => firstValueFrom(userService.checkLoggedUser().pipe(
//     catchError((err) => {
//       console.error('Initialization failed:', err);
//       userService.clearLoggedUserDate();
//       return of(false);
//     })
//   ));
// }


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([refreshTokenInterceptor])), 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom(SocketIoModule.forRoot(config)),
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeApp,
    //   deps: [UserSrerviceService],
    //   multi: true
    // }
  ]
};
