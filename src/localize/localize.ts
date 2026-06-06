import * as en from './languages/en.json';
import { globalData } from '../helpers/globals';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const languages: any = {
    en: en,
};

export function localize(string: string, search = '', replace = '') {
    const langFromLocalStorage = (localStorage.getItem('selectedLanguage') || 'en')
        .replace(/['"]+/g, '')
        .replace('-', '_');

    let lang = `${globalData.hass?.selectedLanguage || globalData.hass?.locale?.language || globalData.hass?.language || langFromLocalStorage || 'en'}`;
    lang = "en";
    let translated: string;

    try {
        translated = string.split('.').reduce((o, i) => o[i], languages[lang]);
    } catch (e) {
        console.warn(`Translation for "${string}" not found in language "${lang}". Falling back to English.`, e);
        translated = string;
    }

    if (translated === undefined) {
        translated = string.split('.').reduce((o, i) => o[i], languages['en']);
    }

    if (search !== '' && replace !== '') {
        translated = translated.replace(search, replace);
    }
    return translated;
}
