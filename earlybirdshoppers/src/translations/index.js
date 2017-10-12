import Cookies from 'js-cookie'
import en from './en'
import hebrew from './hebrew'

export const locales = [
    'en-US',
    "en-GB",
    "en",
    "he",
    "de-DE",
    "de",
    "fr",
]


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
            return en
        case 'he':
            return hebrew
        default:
            return translations
    }
}

export const setLocale = (locale) => {
    currentLocale = locale
    Cookies.set('locale', currentLocale, { expires: 365 })
    translations = initTranslations(locale)
    return translations
}

export default setLocale