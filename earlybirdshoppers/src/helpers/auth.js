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
const event = {
    fans: {},
    payments: {},
    goalPrice: {},
    priceStatus: {},
    ticketPrice: 0,
    title: '',
    object: 'event',
    email: '',
    eventVerified: false,
    photoURL: '',
    uid: 0,
    artists: {},
    venues: {},
    managers: {},
    isPartOfTour: false,
    futureEvents: {},
    pastEvents: {},
    claimed: false,
    collaborationPartners: {
        venues: {},
        artists: {}
    },
}

const payment = {
    uid: 0,
    email: '',
    status: 'initial',
    token: null,
    cancelled: false,
    users: {},
}

const accountTypes = [
    'fan',
    'artist',
    'venue'
]

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
        displayName: displayName,
        accountType,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
        uid: user.uid,
        providerData: user.providerData,
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