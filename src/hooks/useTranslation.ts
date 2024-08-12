import { useTranslation as originalUseTranslation } from 'next-i18next';
import { i18n, TFunction } from 'i18next';

type TranslationHook = {
  t: TFunction;
  i18n: i18n;
  ready: boolean;
  changeLanguage: (lng: string) => Promise<void>;
  currentLanguage: string;
};

export const useTranslation = (ns?: string | string[]): TranslationHook => {
  const { t, i18n, ready } = originalUseTranslation(ns);
  
  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return { t, i18n, ready, changeLanguage, currentLanguage };
};
