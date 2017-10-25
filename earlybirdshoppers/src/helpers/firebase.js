import firebase from 'firebase'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/storage'
import { DB_CONFIG, API_ENDPOINT } from './config'

firebase.initializeApp(DB_CONFIG)

export default firebase
export const ref = firebase.database().ref()
export const auth = firebase.auth
export const getUsers = (callback) => ref.child(`users/`).once('value', callback).catch(callback)
export const getEvents = (callback) => ref.child(`events/`).once('value', callback).catch(callback)
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
