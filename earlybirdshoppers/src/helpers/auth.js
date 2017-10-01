import { ref, auth } from './firebase'

export const signup = ({ email, password, isArtist, displayName }) => {
    return auth().createUserWithEmailAndPassword(email, password)
        .then(saveUser(isArtist, displayName))
}

export const logout = () => {
    return auth().signOut()
}

export const login = (email, pass) => {
    return auth().signInWithEmailAndPassword(email, pass)
}

export const resetPassword = (email) => {
    return auth().sendPasswordResetEmail(email)
}

export const verifyEmail = () => {
    return auth().currentUser.sendEmailVerification()
}

export const saveUser = (isArtist, displayName) => (user) => {
    debugger

    const newUser = {
        displayName: displayName,
        isArtist,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
        uid: user.uid,
        providerData: user.providerData,
    }
    return ref.child(`users/${user.uid}`)
        .set(newUser)
        .then(() => user)
}