import { Injectable, InjectionToken, Inject } from '@angular/core';
import { MsalConfig } from './msal-config';
import * as Msal from 'msal';
import { MsalPolicyType } from './msal.policytype';
import { MsalConfigService } from './msal-config.service';
import { resolveComponentResources } from '../node_modules/@angular/core/src/metadata/resource_loading';

@Injectable()
export class MsalService {

  public error: string;
  private app: Msal.UserAgentApplication;
  private accessToken: string;
  private config: MsalConfig;

  constructor(private msalConfigService: MsalConfigService) {
   
  }

  public getUser() {
    return this.authenticated.then(isauthenticated => isauthenticated ? this.app.getUser() : {});
  }

  get authenticated() {
    return this.token.then(t => !!t);
  }

  get token() {
    return this.getToken();
  }

  public login() {
    return this.config.popup ?
      this.loginPopup() :
      this.loginRedirect();
  }

  private getDefaultConfig(): Promise<MsalConfig> {
    
      let promise = new Promise<MsalConfig>((resolve, reject) => {
        if(this.config !== null && this.config !== undefined){
            resolve(this.config);
        } 
        else {
            return this.msalConfigService.getConfig()
                .then((cfg: MsalConfig) =>{
                    this.config = cfg;           
                    this.config = {
                        ...this.config,
                        popup: !(this.config.popup == null) ? this.config.popup : true,
                        callback: this.config.callback ? this.config.callback : (errorDesc: any, token: any, error: any, tokenType: any) => this.callback(errorDesc, token, error, tokenType),
                        redirectUrl: this.config.redirectUrl,
                        navigateToLoginRequestUrl: !(this.config.navigateToLoginRequestUrl == null) ? this.config.navigateToLoginRequestUrl : false
                    }         
                    resolve(this.config);
                });
        }
    });

    return promise;
  }

  private getDefaultMsalUserAgentApplication(): Promise<Msal.UserAgentApplication> {
      let promise = new Promise<Msal.UserAgentApplication>((resolve, reject) => {
            if (this.app !== undefined && this.app !== null) {
                resolve(this.app);
            }
            else {
                this.getDefaultConfig().then((cfg) => {                    
                    this.app = this.getMsalUserAgentApplication(cfg, MsalPolicyType.SignUpSignIn);
                    resolve(this.app);
                })
            }
      });

      return promise;
  }

  public getToken(): Promise<string> {  
     
    return this.getDefaultMsalUserAgentApplication().then((app) =>
        app.acquireTokenSilent(this.config.graphScopes)
        .then(token => {
            return token;
        }).catch(error => {
            return app.acquireTokenPopup(this.config.graphScopes)
            .then(token => {
                return Promise.resolve(token);
            }).catch(innererror => {
                return Promise.resolve('');
            });
        }));
  }

  public logout() {
    this.app.logout();
  }

  public loginPopup() {
    return this.getDefaultMsalUserAgentApplication().then((app) =>
        app.loginPopup(this.config.graphScopes).then((idToken) => {
          app.acquireTokenSilent(this.config.graphScopes).then(
            (token: string) => {
            return Promise.resolve(token);
            }, (error: any) => {
            this.app.acquireTokenPopup(this.config.graphScopes).then(
                (token: string) => {
                return Promise.resolve(token);
                }, (innererror: any) => {
                console.log('Error acquiring the popup:\n' + innererror);
                return Promise.resolve('');
                });
            });
        }, (error: any) => {
        console.log('Error during login:\n' + error);
        return Promise.resolve('');
    }));
  }

  private loginRedirect() {
    this.getDefaultMsalUserAgentApplication().then((app) =>{
        app.loginRedirect (this.config.graphScopes);
    }) 
    
    return this.getToken().then(() => {
      Promise.resolve(this.app.getUser());
    });
  }

  private getFullUrl(url: string): string {
    // this create a absolute url from a relative one.
    const pat = /^https?:\/\//i;
    return pat.test(url) ? url : this.origin() + url;
  }

  private origin() {
    return (window.location.origin) ? window.location.origin :
      window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  }

  private callback(errorDesc: any, token: any, error: any, tokenType: any) {
    if (token) {
        this.accessToken = token;
      }
      if (errorDesc) {
        if (errorDesc.indexOf('AADB2C90118') > -1) {                    
          this.app = this.getMsalUserAgentApplication(this.config, MsalPolicyType.PasswordReset);
          this.login();
        }
        else {
            this.app = this.getMsalUserAgentApplication(this.config, MsalPolicyType.SignUpSignIn);
        }
      }
  }

  private getMsalUserAgentApplication(config: MsalConfig, policyType: MsalPolicyType): Msal.UserAgentApplication {
      switch(policyType) {
          case MsalPolicyType.SignUpSignIn:
            return new Msal.UserAgentApplication(this.config.clientID, this.config.signUpSignInAuthority, this.config.callback,
                {
                  navigateToLoginRequestUrl: this.config.navigateToLoginRequestUrl,
                  redirectUri: this.getFullUrl(this.config.redirectUrl)
                });            
          case MsalPolicyType.PasswordReset:
            return new Msal.UserAgentApplication(this.config.clientID, this.config.passwordresetAuthority, this.config.callback);            
      }
    
  }
}
