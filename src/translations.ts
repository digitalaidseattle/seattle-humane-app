import { Locale } from '@types';
import en from './locales/en.json';

const translations = {
  en,
};

interface GetTranslationParams {
  locale:Locale,
  key: keyof typeof en,
}

export default function getTranslation({ locale, key }:GetTranslationParams) {
  return translations[locale][key];
}
