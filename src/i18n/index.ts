import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { fallbackLanguage } from './config';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: `${fallbackLanguage}`,
    ns: ['common', 'calendar', 'chat', 'forum', 'groups', 'preferences'],
    defaultNS: 'common',
    load: 'currentOnly',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false,
  });

export default i18n;
