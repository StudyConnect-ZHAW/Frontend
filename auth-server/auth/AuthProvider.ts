import { Request, Response, NextFunction } from 'express';
import {
  Configuration,
  ConfidentialClientApplication,
  CryptoProvider,
  AuthorizationUrlRequest,
  AuthorizationCodeRequest
} from '@azure/msal-node';
import axios from 'axios';
import {
  msalConfig,
  TENANT_SUBDOMAIN,
  REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI,
} from '../authConfig';

interface AuthProviderConfig {
  msalConfig: Configuration;
  redirectUri: string;
  postLogoutRedirectUri: string;
}

class AuthProvider {
  config: AuthProviderConfig;
  cryptoProvider: CryptoProvider;

  constructor(config: AuthProviderConfig) {
    this.config = config;
    this.cryptoProvider = new CryptoProvider();
  }

  getMsalInstance(msalConfig: Configuration): ConfidentialClientApplication {
    return new ConfidentialClientApplication(msalConfig);
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction,
    options = {}
  ): Promise<void> {
    // create a GUID for crsf
    req.session.csrfToken = this.cryptoProvider.createNewGuid();

    /**
     * The MSAL Node library allows you to pass your custom state as state parameter in the Request object.
     * The state parameter can also be used to encode information of the app's state before redirect.
     * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
     */
    const state = this.cryptoProvider.base64Encode(
      JSON.stringify({
        csrfToken: req.session.csrfToken,
        redirectTo: '/',
      })
    );

    const authCodeUrlRequestParams: Partial<AuthorizationUrlRequest> = {
      state: state,
      scopes: [],
    };

    const authCodeRequestParams: Partial<AuthorizationCodeRequest> = {
      state: state,
      scopes: [],
    };

    /**
     * If the current msal configuration does not have cloudDiscoveryMetadata or authorityMetadata, we will
     * make a request to the relevant endpoints to retrieve the metadata. This allows MSAL to avoid making
     * metadata discovery calls, thereby improving performance of token acquisition process.
     */
    if (!this.config.msalConfig.auth.authorityMetadata) {
      const authorityMetadata = await this.getAuthorityMetadata();
      this.config.msalConfig.auth.authorityMetadata = JSON.stringify(
        authorityMetadata
      );
    }

    const msalInstance = this.getMsalInstance(this.config.msalConfig);

    // trigger the first leg of auth code flow
    return this.redirectToAuthCodeUrl(
      req,
      res,
      next,
      authCodeUrlRequestParams,
      authCodeRequestParams,
      msalInstance
    );
  }

  async handleRedirect(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /**
     * Check for missing required session or body data
     */
    if (!req.body.code || !req.session.pkceCodes) {
      return next(new Error('Missing authorization code or PKCE verifier'));
    }

    const authCodeRequest: AuthorizationCodeRequest = {
      ...req.session.authCodeRequest,
      code: req.body.code,
      codeVerifier: req.session.pkceCodes.verifier,
    };

    try {
      const msalInstance = this.getMsalInstance(this.config.msalConfig);
      msalInstance.getTokenCache().deserialize(req.session.tokenCache?? '');

      const tokenResponse = await msalInstance.acquireTokenByCode(
        authCodeRequest,
        req.body
      );

      //TODO muss wieder entfernt werden!!!
      console.log('✅ Access Token:', tokenResponse.accessToken);
      console.log('✅ ID Token:', tokenResponse.idToken);
      console.log('✅ Alle Token-Daten:', tokenResponse);

      req.session.tokenCache = msalInstance.getTokenCache().serialize();
      req.session.idToken = tokenResponse.idToken;
      req.session.account = tokenResponse.account ?? undefined;
      req.session.isAuthenticated = true;

      const state = JSON.parse(
        this.cryptoProvider.base64Decode(req.body.state)
      );
      res.redirect(state.redirectTo);
    } catch (error) {
      next(error);
    }
  }

  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /**
     * Construct a logout URI and redirect the user to end the
     * session with Azure AD. For more information, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
     */
    const logoutUri = `${this.config.msalConfig.auth.authority}${TENANT_SUBDOMAIN}.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=${this.config.postLogoutRedirectUri}`;

    req.session.destroy(() => {
      res.redirect(logoutUri);
    });
  }

  /**
   * Prepares the auth code request parameters and initiates the first leg of auth code flow
   */
  async redirectToAuthCodeUrl(
    req: Request,
    res: Response,
    next: NextFunction,
    authCodeUrlRequestParams: Partial<AuthorizationUrlRequest>,
    authCodeRequestParams: Partial<AuthorizationCodeRequest>,
    msalInstance: ConfidentialClientApplication
  ): Promise<void> {
    // Generate PKCE Codes before starting the authorization flow
    const { verifier, challenge } =
      await this.cryptoProvider.generatePkceCodes();

    // Set generated PKCE codes and method as session vars
    req.session.pkceCodes = {
      challengeMethod: 'S256',
      verifier: verifier,
      challenge: challenge,
    };

    /**
     * By manipulating the request objects below before each request, we can obtain
     * auth artifacts with desired claims. For more information, visit:
     * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationurlrequest
     * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationcoderequest
     **/

    req.session.authCodeUrlRequest = {
      ...authCodeUrlRequestParams,
      redirectUri: this.config.redirectUri,
      responseMode: 'form_post', // recommended for confidential clients
      codeChallenge: challenge,
      codeChallengeMethod: 'S256',
    };

    req.session.authCodeRequest = {
      ...authCodeRequestParams,
      redirectUri: this.config.redirectUri,
      code: '',
    };

    try {
      const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(
        req.session.authCodeUrlRequest
      );
      res.redirect(authCodeUrlResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves oidc metadata from the openid endpoint
   * @returns
   */
  async getAuthorityMetadata(): Promise<any> {
    const endpoint = `${this.config.msalConfig.auth.authority}${TENANT_SUBDOMAIN}.onmicrosoft.com/v2.0/.well-known/openid-configuration`;
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

const authProvider = new AuthProvider({
  msalConfig: msalConfig,
  redirectUri: REDIRECT_URI,
  postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
});

export default authProvider;