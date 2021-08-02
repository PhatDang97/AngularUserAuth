import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(localStorage.getItem('token') != null){
      const cloneRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
      });

      return next.handle(cloneRequest).pipe(
        tap(
          suc => { },
          err => {
            if(err.status == 401) {
              localStorage.removeItem('token');
              this.router.navigateByUrl('/user/login');
            }
            else if(err.status == 403){
              this.router.navigateByUrl('/forbidden');
            }
          }
        )
      )
    }
    else{
      return next.handle(request.clone());
    }
  }
}
