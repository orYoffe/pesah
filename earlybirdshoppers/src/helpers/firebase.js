import firebase from 'firebase'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/storage'
import {
    DB_CONFIG,
    API_ENDPOINT,
    GET_ARTISTS,
    GET_VENUES,
    GET_EVENTS,
    GET_FANS,
 } from './config'

firebase.initializeApp(DB_CONFIG)

export default firebase
export const ref = firebase.database().ref()
export const auth = firebase.auth
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

export const getUser = (id, callback) => ref.child(`users/${id}`).once('value', callback).catch(callback)
export const getFan = (id, callback) => ref.child(`fans/${id}`).once('value', callback).catch(callback)
export const getArtist = (id, callback) => ref.child(`artists/${id}`).once('value', callback).catch(callback)
export const getVenue = (id, callback) => ref.child(`venues/${id}`).once('value', callback).catch(callback)
export const getEvent = (id, callback) => ref.child(`events/${id}`).once('value', callback).catch(callback)
export const getPayment = (id, callback) => ref.child(`payments/${id}`).once('value', callback).catch(callback)
export const post = (url, body, callback) => {
    if (!auth().currentUser) {
        console.log('Not authenticated. Make sure you\'re signed in!')
        return 404
    }
    
    // Get the Firebase auth token to authenticate the request
    return firebase.auth().currentUser.getIdToken().then(function (token) {
        document.cookie = '__session=' + token + ';max-age=3600';
        return fetch(`${API_ENDPOINT}${url}`, {
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
export const get = (url) => fetch(url).then(res => res.json())
export const getEvents = (callback) => get(GET_EVENTS).then(callback).catch(callback)
export const getArtists = (callback) => get(GET_ARTISTS).then(callback).catch(callback)
export const getVenues = (callback) => get(GET_VENUES).then(callback).catch(callback)
export const getFans = (callback) => get(GET_FANS).then(callback).catch(callback)
