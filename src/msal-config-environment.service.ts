import { Injectable, InjectionToken, Inject } from '@angular/core';
import { MsalConfig } from './msal-config';
import { MsalConfigEnvironment } from './msal-config-environment';
import { HttpClient } from '@angular/common/http';

export const MSAL_CONFIG_ENVIRONMENT = new InjectionToken<string>('MSAL_CONFIG_ENVIRONMENT');

@Injectable()
export class MsalConfigEnvironmentService {

  constructor(@Inject(MSAL_CONFIG_ENVIRONMENT) private configEnvironment: MsalConfigEnvironment,
            private http: HttpClient) { } 
  

  public getConfig(): Promise<MsalConfig> {
    return this.http.get<MsalConfig>(this.configEnvironment.path).toPromise();
  }
}
