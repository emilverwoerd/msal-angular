import { Injectable, InjectionToken, Inject } from '@angular/core';
import { MsalConfig } from './msal-config';
import { MsalConfigLocation } from './msal-config-location';
import { HttpClient } from '@angular/common/http';

export const MSAL_CONFIG_LOCATION = new InjectionToken<string>('MSAL_CONFIG_LOCATION');

@Injectable()
export class MsalConfigService {

  constructor(@Inject(MSAL_CONFIG_LOCATION) private configLocation: MsalConfigLocation,
            private http: HttpClient) { } 
  

  public getConfig(): Promise<MsalConfig> {
    return this.http.get<MsalConfig>(this.configLocation.path).toPromise();
  }
}
