import Cookies from 'js-cookie'
import { setLocale as getLocale } from '../translations'


const SET_LOCALE = 'SET_LOCALE'
const SET_MAPS_READY = 'SET_MAPS_READY'

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    locale,
})
export const setMapsIsReady = (isMapsReady) => ({
    type: SET_MAPS_READY,
    isMapsReady,
})

export let currentLocale = Cookies.get('locale') || window.navigator.language || window.navigator.languages[0] || 'en'


export default (state = {
    currentLocale,
    trans: getLocale(currentLocale),
    isMapsReady: false,
}, action) => {
    switch (action.type) {
        case SET_LOCALE:
            currentLocale = action.locale
            return {
                currentLocale,
                isMapsReady: false,
                trans: getLocale(currentLocale),
            } 
        case SET_MAPS_READY:
            return {
                ...state,
                isMapsReady: action.isMapsReady,
            } 
        default:
            return state
    }
}
