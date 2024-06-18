import * as en from './languages/en.json';
import {globalData} from '../helpers/globals';

const languages: any = {
    en: en,
};

export function localize(string: string, search = '', replace = '') {
    const langFromLocalStorage = (localStorage.getItem('selectedLanguage') || 'en')
        .replace(/['"]+/g, '')
        .replace('-', '_');

    const lang = `${globalData.hass?.selectedLanguage || globalData.hass?.locale?.language || globalData.hass?.language || langFromLocalStorage}`;

    let translated: string;

    try {
        translated = string.split('.').reduce((o, i) => o[i], languages[lang]);
    } catch (e) {
        translated = string.split('.').reduce((o, i) => o[i], languages['en']);
    }

    if (translated === undefined) {
        translated = string.split('.').reduce((o, i) => o[i], languages['en']);
    }

    if (search !== '' && replace !== '') {
        translated = translated.replace(search, replace);
    }
    return translated;
}
