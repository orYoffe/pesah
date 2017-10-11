import { ref, auth } from './firebase'

const eventActions = {
    create: {
        event: () => true,
        payment: () => true,
    },
    update: {},
    remove: {},
    get: {}
}

// const accountTypes = [
//     'fan',
//     'artist',
//     'venue'
// ]

// export const logout = () => auth().signOut()

// export const login = (email, pass) => auth().signInWithEmailAndPassword(email, pass)

// export const resetPassword = (email) => auth().sendPasswordResetEmail(email)

// export const verifyEmail = () => auth().currentUser.sendEmailVerification()

// export const signup = ({
//     email,
//     password,
//     accountType,
//     displayName
// }) => {
//     if (!accountTypes.includes(accountType)) {
//         return false
//     }
//     return auth().createUserWithEmailAndPassword(email, password)
//         .then(user => saveUser(user, accountType, displayName))
// }

// export const saveUser = (user, accountType, displayName) => {
//     if (!accountType || !displayName || !user) {
//         return logout()
//     }
//     const newUser = {
//         displayName: displayName,
//         accountType,
//         email: user.email,
//         emailVerified: user.emailVerified,
//         photoURL: user.photoURL,
//         isAnonymous: user.isAnonymous,
//         uid: user.uid,
//         providerData: user.providerData,
//     }

//     return user.updateProfile({
//         displayName
//     })
//     .then(() => ref.child(`users/${user.uid}`)
//     .set(newUser))
//     .then(() => ref.child(`${accountType}s/${user.uid}`)
//         .set(newUser))
//     .then(() => user)
// }