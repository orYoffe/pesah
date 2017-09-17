import firebase from 'firebase'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/storage'
import { DB_CONFIG } from './config'

firebase.initializeApp(DB_CONFIG)
export default firebase
