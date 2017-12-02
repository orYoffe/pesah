// import { isDev } from './common'
export const DB_CONFIG = {
    apiKey: "AIzaSyCmnoJEwqiaq-lavYiVySWdo77uSWIcFK4",
    authDomain: "earlybirdshopers.firebaseapp.com",
    databaseURL: "https://earlybirdshopers.firebaseio.com",
    projectId: "earlybirdshopers",
    storageBucket: "earlybirdshopers.appspot.com",
    messagingSenderId: "853475325627"
}
const GMAPS_API_KEY = 'AIzaSyBb-v3zujUJ9ZS4T7Inbo6pRHetDpRen3g'
export const getMapsApi = (countryCode, language) =>
    `https://maps.googleapis.com/maps/api/js?v=3.29&libraries=places,geometry,drawing,places&key=${GMAPS_API_KEY}&region=${countryCode || 'US'}&language=${language || 'en'}&callback=mapsInit`

// activate to test local functions
// export const API_ENDPOINT = isDev ? 'http://localhost:5000/earlybirdshopers/us-central1/api/' : 'https://us-central1-earlybirdshopers.cloudfunctions.net/api/'
export const API_ENDPOINT = 'https://us-central1-earlybirdshopers.cloudfunctions.net/api/'
export const GET_ARTISTS = `${API_ENDPOINT}getArtists`
export const GET_VENUES = `${API_ENDPOINT}getVenues`
export const GET_EVENTS = `${API_ENDPOINT}getEvents`
export const GET_FANS = `${API_ENDPOINT}getFans`
export const GET_EXPLORE = `${API_ENDPOINT}explore`
export const CREATE_EVENT = `${API_ENDPOINT}createEvent`
export const CREATE_USER = `${API_ENDPOINT}createUser`
export const GET_ROOM = `${API_ENDPOINT}getRoom`
export const CREATE_NON_USER_VENUE = `${API_ENDPOINT}createNonUserVenue`
export const UPDATE_NON_USER_VENUE = `${API_ENDPOINT}updateNonUserVenue`
export const SEND_BOOKING_REQUEST = `${API_ENDPOINT}sendBookingRequest`
export const APPROVE_BOOKING_REQUEST = `${API_ENDPOINT}approveBookingRequest`
export const DECLINE_BOOKING_REQUEST = `${API_ENDPOINT}declineBookingRequest`
export const SET_YOUTUBE_ID_REQUEST = `${API_ENDPOINT}youtubeID`
