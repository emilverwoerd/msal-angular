import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from "@angular/core";
import { MsalService } from "./msal.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MsalInterceptor} from './msal.interceptor'
import { MsalGuard } from "./msal.guard";
import { MsalConfigLocation } from "./msal-config-location";
import { MSAL_CONFIG_LOCATION, MsalConfigService } from "./msal-config.service";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule],
    providers: [MsalGuard]
})

export class MsalModule {
    static forRoot(configLocation: MsalConfigLocation): ModuleWithProviders {        
        return {
            ngModule: MsalModule,
            providers: [
                { provide: MSAL_CONFIG_LOCATION, useValue: configLocation },                
                MsalConfigService,
                MsalService,
                { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true }
            ]
        };
    }
}

