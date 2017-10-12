import Cookies from 'js-cookie'
import { setLocale as getLocale } from '../translations'


const SET_LOCALE = 'SET_LOCALE'

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    locale
})

export let currentLocale = Cookies.get('locale') || window.navigator.language || window.navigator.languages[0] || 'en'


export default (state = {
    currentLocale,
    trans: getLocale(currentLocale),
}, action) => {
    switch (action.type) {
        case 'SET_LOCALE':
            currentLocale = action.locale
            return {
                currentLocale,
                trans: getLocale(currentLocale),
            } 
        default:
            return state
    }
}
