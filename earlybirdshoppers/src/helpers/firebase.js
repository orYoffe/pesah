import firebase from 'firebase'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/storage'
import { DB_CONFIG } from './config'

firebase.initializeApp(DB_CONFIG)
export default firebase
export const ref = firebase.database().ref()
export const auth = firebase.auth
export const getUser = (id, callback) => ref.child(`users/${id}`).once('value', callback)
export const getFan = (id, callback) => ref.child(`fans/${id}`).once('value', callback)
export const getArtist = (id, callback) => ref.child(`artists/${id}`).once('value', callback)
export const getVenue = (id, callback) => ref.child(`venues/${id}`).once('value', callback)
export const getEvent = (id, callback) => ref.child(`events/${id}`).once('value', callback)
