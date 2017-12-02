import { isDev } from './common'
import firebase from 'firebase'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/storage'
import {
    DB_CONFIG,
    GET_ARTISTS,
    GET_VENUES,
    GET_EVENTS,
    GET_FANS,
    GET_EXPLORE,
    CREATE_EVENT,
    CREATE_USER,
    GET_ROOM,
    CREATE_NON_USER_VENUE,
    UPDATE_NON_USER_VENUE,
    SEND_BOOKING_REQUEST,
    APPROVE_BOOKING_REQUEST,
    DECLINE_BOOKING_REQUEST,
    SET_YOUTUBE_ID_REQUEST,
 } from './config'

firebase.initializeApp(DB_CONFIG)

export default firebase
export const database = firebase.database
export const ref = firebase.database().ref()
export const storageRef = firebase.storage().ref()
export const auth = firebase.auth
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const fbProvider = new firebase.auth.FacebookAuthProvider();
// for service worker
// export const messaging = firebase.messaging()

// // for srvice worker notifs
// messaging.setBackgroundMessageHandler(function (payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = "You've got a new message";
//     const notificationOptions = {
//         body: "You've got a new message on Raise The Bar",
//         icon: '/favicon.ico'
//     };

//     return self.registration.showNotification(notificationTitle, // eslint-disable-line no-restricted-globals
//         notificationOptions);
// });

// ======== Firebase functions
export const getUser = (id, callback) => ref.child(`users/${id}`).once('value', callback).catch(callback)
export const getFan = (id, callback) => ref.child(`fans/${id}`).once('value', callback).catch(callback)
export const getArtist = (id, callback) => ref.child(`artists/${id}`).once('value', callback).catch(callback)
export const getVenue = (id, callback) => ref.child(`venues/${id}`).once('value', callback).catch(callback)
export const getEvent = (id, callback) => ref.child(`events/${id}`).once('value', callback).catch(callback)
export const getPayment = (id, callback) => ref.child(`payments/${id}`).once('value', callback).catch(callback)
export const getAnalytics = (path, callback) => ref.child(`analytics/${path}`).once('value', callback).catch(callback)


// ======== Firebase storage
export const getPhotoUrl = (userUid, type, callback) => storageRef.child(`images/${userUid}/${type}.png`).getDownloadURL().then(callback).catch(callback)
export const getTrackUrl = (userUid, type, callback) => storageRef.child(`tracks/${userUid}/${type}.flac`).getDownloadURL().then(callback).catch(callback)

// ======== API functions
export const get = (url) => fetch(url).then(res => res.json())
export const post = (url, body, callback) => {
    if (!auth().currentUser) {
        console.log('Not authenticated. Make sure you\'re signed in!')
        return 404
    }

    // Get the Firebase auth token to authenticate the request
    return firebase.auth().currentUser.getIdToken().then(function (token) {
        document.cookie = '__session=' + token + ';max-age=3600';
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }).then(res => res.json())
    })
}

// ======= GET
export const getEvents = (callback) => get(GET_EVENTS).then(callback).catch(callback)
export const getArtists = (callback) => get(GET_ARTISTS).then(callback).catch(callback)
export const getVenues = (callback) => get(GET_VENUES).then(callback).catch(callback)
export const getFans = (callback) => get(GET_FANS).then(callback).catch(callback)
export const getExplore = (callback) => get(GET_EXPLORE).then(callback).catch(callback)

// ======= POST
export const createEvent = (body, callback) => post(CREATE_EVENT, body, callback).then(callback).catch(callback)
export const createUser = (body, callback) => post(CREATE_USER, body, callback).then(callback).catch(callback)
export const createNonUserVenue = (body, callback) => post(CREATE_NON_USER_VENUE, body, callback).then(callback).catch(callback)
export const updateNonUserVenue = (body, callback) => post(UPDATE_NON_USER_VENUE, body, callback).then(callback).catch(callback)
export const getRoom = (body, callback) => post(GET_ROOM, body, callback).then(callback).catch(callback)
export const requestBooking = (body, callback) => post(SEND_BOOKING_REQUEST, body, callback).then(callback).catch(callback)
export const approveBooking = (body, callback) => post(APPROVE_BOOKING_REQUEST, body, callback).then(callback).catch(callback)
export const declineBooking = (body, callback) => post(DECLINE_BOOKING_REQUEST, body, callback).then(callback).catch(callback)
export const setYoutubeUrl = (body, callback) => post(SET_YOUTUBE_ID_REQUEST, body, callback).then(callback).catch(callback)

if (isDev) {
    window.storageRef = storageRef
    window.firebase = firebase
}
