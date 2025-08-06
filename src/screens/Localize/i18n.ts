import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// JSON 파일 직접 import
import koTranslation from './locales/ko/translation.json';
import jaTranslation from './locales/ja/translation.json';
import enTranslation from './locales/en/translation.json';

const supportedLngs = ['en', 'ko', 'ja'];

const resources = {
    en: {translation: enTranslation},
    ko: {translation: koTranslation},
    ja: {translation: jaTranslation},
};

// 기기 설정에서 사용자가 선호하는 언어 목록을 가져옵니다.
const locales = RNLocalize.getLocales();

let initialLanguage = 'en';

for (const locale of locales) {
    if (supportedLngs.includes(locale.languageCode)) {
        initialLanguage = locale.languageCode;
        break;
    }
}

i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage, // 기기 설정에 따라 결정된 초기 언어
    fallbackLng: 'en', // 기기 언어가 지원되지 않을 때 사용할 언어
    interpolation: {
        escapeValue: false,
    },
    supportedLngs,
});

export default i18n;
