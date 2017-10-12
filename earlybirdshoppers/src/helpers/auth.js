import { ref, auth } from './firebase'

const fan = {
    displayName: '',
    accountType: 'fan',
    email: '',
    emailVerified: false,
    photoURL: '',
    isAnonymous: false,
    uid: 0,
    providerData: null,
}
const artist = {
    displayName: '',
    accountType: 'artist',
    email: '',
    emailVerified: false,
    photoURL: '',
    isAnonymous: false,
    uid: 0,
    providerData: null,
    members: {},
    managers: {},
    futureEvents: {},
    pastEvents: {},
    claimed: false,
    accounts: {},
    collaborationPartners: {
        venues: {},
        artists: {}
    },
}
const venue = {
    displayName: '',
    accountType: 'venue',
    email: '',
    emailVerified: false,
    photoURL: '',
    isAnonymous: false,
    uid: 0,
    providerData: null,
    members: {},
    managers: {},
    futureEvents: {},
    pastEvents: {},
    claimed: false,
    accounts: {},
    collaborationPartners: {
        venues: {},
        artists: {}
    },
}

const accounts = {
    fan,
    artist,
    venue
}
const accountTypes = Object.keys(accounts)

export const logout = () => auth().signOut()

export const login = (email, pass) => auth().signInWithEmailAndPassword(email, pass)

export const resetPassword = (email) => auth().sendPasswordResetEmail(email)

export const verifyEmail = () => auth().currentUser.sendEmailVerification()

export const signup = ({
    email,
    password,
    accountType,
    displayName
}) => {
    if (!accountTypes.includes(accountType)) {
        return false
    }
    return auth().createUserWithEmailAndPassword(email, password)
        .then(user => saveUser(user, accountType, displayName))
}

export const saveUser = (user, accountType, displayName) => {
    if (!accountType || !displayName || !user) {
        return logout()
    }
    const newUser = {
        ...accounts[accountType],
        ...{
            displayName: displayName,
            accountType,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
            uid: user.uid,
            providerData: user.providerData,
        },
    }

    return user.updateProfile({
        displayName
    })
    .then(() => ref.child(`users/${user.uid}`)
    .set(newUser))
    .then(() => ref.child(`${accountType}s/${user.uid}`)
        .set(newUser))
    .then(() => user)
}