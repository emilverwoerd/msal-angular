import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from "@angular/core";
import { MsalService } from "./msal.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MsalInterceptor} from './msal.interceptor'
import { MsalGuard } from "./msal.guard";
import { MsalConfigEnvironment } from "./msal-config-environment";
import { MSAL_CONFIG_ENVIRONMENT, MsalConfigEnvironmentService } from "./msal-config-environment.service";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule],
    providers: [MsalGuard]
})

export class MsalModule {
    static forRoot(configEnvironment: MsalConfigEnvironment): ModuleWithProviders {        
        return {
            ngModule: MsalModule,
            providers: [
                { provide: MSAL_CONFIG_ENVIRONMENT, useValue: configEnvironment },                
                MsalConfigEnvironmentService,
                MsalService,
                { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true }
            ]
        };
    }
}

