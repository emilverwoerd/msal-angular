import { tokenReceivedCallback } from 'msal/lib-commonjs/UserAgentApplication';

export class MsalConfig {
    public clientID: string;
    public graphScopes: string[];
    public popup ? = false;
    public navigateToLoginRequestUrl ? = false;
    public redirectUrl: string;
    public signUpSignInAuthority: string = '';
    public passwordresetAuthority?: string = '';
    public callback?: tokenReceivedCallback;
}
