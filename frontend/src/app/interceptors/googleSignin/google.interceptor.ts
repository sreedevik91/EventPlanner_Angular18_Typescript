import { HttpEvent, HttpEventType, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { tap } from 'rxjs';

export const googleInterceptor: HttpInterceptorFn = (req:HttpRequest<any>, next:HttpHandlerFn) => {
  return next(req).pipe(
    tap((event:HttpEvent<any>)=>{
      console.log('callback event: ', event);
      
    })
  );

};
