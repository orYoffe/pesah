import { ref, auth } from './firebase'

export const signup = (email, pass) => {
    return auth().createUserWithEmailAndPassword(email, pass)
        // .then(saveUser)
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

export const saveUser = (user) => {
    // debugger

    // const newUser = {
    //     displayName: user.displayName,
    //     email: user.email,
    //     emailVerified: user.emailVerified,
    //     photoURL: user.photoURL,
    //     isAnonymous: user.isAnonymous,
    //     uid: user.uid,
    //     providerData: user.providerData,
    // }
    // return ref.child(`users/${user.uid}/info`)
    //     .set(newUser)
    //     .then(() => user)
}