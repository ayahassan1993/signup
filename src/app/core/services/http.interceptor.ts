import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
    HttpHeaders,
    HttpRequest,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/app/environments/environment';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(
        private toast: ToastrService,
        private spinner: NgxSpinnerService
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinner.show();
        let headers: HttpHeaders = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
        });

        request = request.clone({
            headers: headers,
            url: `${environment.apiUrl}/${request.url}`,
        });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.toast.error(error?.error?.errors ? error?.error?.errors : error?.error?.message)
                return throwError(() => error);
            }),
            finalize(() => {
                this.spinner.hide()
            }
            )
        );
    }
}


