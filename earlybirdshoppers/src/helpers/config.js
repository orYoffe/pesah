
export const DB_CONFIG = {
    apiKey: "AIzaSyCmnoJEwqiaq-lavYiVySWdo77uSWIcFK4",
    authDomain: "earlybirdshopers.firebaseapp.com",
    databaseURL: "https://earlybirdshopers.firebaseio.com",
    projectId: "earlybirdshopers",
    storageBucket: "earlybirdshopers.appspot.com",
    messagingSenderId: "853475325627"
}

//isDev ? 'http://localhost:5000/earlybirdshopers/us-central1/api/' : 'https://us-central1-earlybirdshopers.cloudfunctions.net/api/' 

export const API_ENDPOINT = 'https://us-central1-earlybirdshopers.cloudfunctions.net/api/' 
export const GET_ARTISTS = `${API_ENDPOINT}getArtists`
export const GET_VENUES = `${API_ENDPOINT}getVenues`
export const GET_EVENTS = `${API_ENDPOINT}getEvents`
export const GET_FANS = `${API_ENDPOINT}getFans`
export const GET_EXPLORE = `${API_ENDPOINT}explore`
export const CREATE_EVENT = `${API_ENDPOINT}createEvent`
export const CREATE_USER = `${API_ENDPOINT}createUser`