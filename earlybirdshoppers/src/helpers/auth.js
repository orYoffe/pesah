import { ref, auth } from './firebase'

const accountTypes = ['fan', 'artist', 'venue']

export const signup = ({ email, password, accountType, displayName }) => {
    if (!accountTypes.includes(accountType)) {
        return false
    }
    return auth().createUserWithEmailAndPassword(email, password)
        .then(saveUser(accountType, displayName))
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

export const saveUser = (accountType, displayName) => (user) => {
    debugger

    verifyEmail()
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
    return ref.child(`${accountType}s/${user.uid}`)
        .set(newUser)
        .then(() => user)
}