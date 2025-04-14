import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en-US',
        lng:
            typeof window !== 'undefined'
                ? localStorage.getItem('lang') || 'en-US'
                : 'en-US',
        ns: ['common'],
        defaultNS: 'common',
        load: 'all',
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
