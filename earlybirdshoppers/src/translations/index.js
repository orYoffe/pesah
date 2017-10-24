import Cookies from 'js-cookie'
import en from './en'
import hebrew from './hebrew'
import { auth } from '../helpers/firebase'

// TODO create support for rtl

export const locales = [
    'en-US',
    "en-GB",
    "en",
    "he",
    "de-DE",
    "de",
    "fr",
]
const html = document.getElementsByTagName('html')[0]

export let currentLocale = 'en-US'

export let translations = en

const initTranslations = (locale) => {

    switch (locale) {
        case 'en-US':
        case 'en-GB':
        case 'en':
        case 'fr':
        case 'de':
        case 'de-DE':
            html.lang = 'en'
            return en
        case 'he':
            html.lang = 'he'
            return hebrew
        default:
            return translations
    }
}

export const setLocale = (locale) => {
    currentLocale = locale
    Cookies.set('locale', currentLocale, { expires: 365 })
    auth().languageCode = locale
    translations = initTranslations(locale)
    return translations
}

export default setLocale