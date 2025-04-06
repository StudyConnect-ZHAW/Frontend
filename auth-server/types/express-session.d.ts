import 'express-session';

declare module 'express-session' {
    interface SessionData {
        cookie: Cookie;
        authCodeUrlRequest?: Partial<AuthorizationUrlRequest>;
        authCodeRequest?: Partial<AuthorizationCodeRequest>;
        pkceCodes?: {
        challengeMethod: string;
        verifier: string;
        challenge: string;
        };
        csrfToken?: string;
        tokenCache?: string;
        idToken?: string;
        isAuthenticated?: boolean;
        account?: {
            username?: string;
            name?: string;
            idTokenClaims?: {
                [key: string]: unknown;
            };
        };
    }
}