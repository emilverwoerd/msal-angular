import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { MsalService } from './msal.service';
import { MsalConfigEnvironment } from './msal-config-environment';
import { MSAL_CONFIG_ENVIRONMENT } from './msal-config-environment.service';

@Injectable()
export class MsalInterceptor implements HttpInterceptor {

    constructor(@Inject(MSAL_CONFIG_ENVIRONMENT) private configEnvironment: MsalConfigEnvironment,
                private msalService: MsalService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {       
        if (req.url === this.configEnvironment.path) {
            return next.handle(req);
        }
        else {        
            return from(
                this.msalService.getToken().then(token => {
                const JWT = `Bearer ${token}`;
                return req.clone({
                    setHeaders: {
                        Authorization: JWT,
                    },
                });
            })).pipe(mergeMap(r => next.handle(r)));
        }
    }
}
