import 'i18next';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: {
            common: {
                welcomeUser: string;
            };
        };
    }
}