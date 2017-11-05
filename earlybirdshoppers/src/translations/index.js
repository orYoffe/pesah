import Cookies from 'js-cookie'
import en from './en'
import hebrew from './hebrew'
import { auth } from '../helpers/firebase'
import { getMapsApi } from '../helpers/config'

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
let isLaguageChanged = false

const GMAP_SCRIPT_ID = 'gmaps-jssdk'
let currentCountryCode, currentLanguage
const shouldReload = (countryCode, language) => {
    if (countryCode && language) {
        return countryCode !== currentCountryCode || language !== currentLanguage
    }
    currentCountryCode = countryCode
    currentLanguage = language
    return false
}
const loadGmapScript = (countryCode, language) => {
    
    const uri = getMapsApi(countryCode, language)
    const gmapScript = document.getElementById(GMAP_SCRIPT_ID)
    if (isLaguageChanged && shouldReload(countryCode, language)) {
        window.location.reload()
    }
    if (!gmapScript) {
        const js = document.createElement('script')
        js.id = GMAP_SCRIPT_ID
        js.src = uri
        js.defer = true
        js.async = true
        document.body.appendChild(js)
    }
}

const html = document.getElementsByTagName('html')[0]

export let currentLocale = Cookies.get('locale') || window.navigator.language || window.navigator.languages[0] || 'en'

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
            // TODO fix for other countries
            loadGmapScript('GB', 'en')
            return en
        case 'he':
            html.lang = 'he'
            loadGmapScript('IL', 'iw')
            return hebrew
        default:
            return translations
    }
}

export const setLocale = (locale) => {
    isLaguageChanged = currentLocale !== locale
    currentLocale = locale
    Cookies.set('locale', currentLocale, { expires: 365 })
    auth().languageCode = locale
    translations = initTranslations(locale)
    return translations
}

export default setLocale