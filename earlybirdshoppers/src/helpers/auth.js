import { auth, createUser
    // googleProvider, fbProvider
} from './firebase'

const accountTypes = ['fan', 'artist', 'venue']

export const logout = () => auth().signOut()

export const login = (email, pass) => auth().signInWithEmailAndPassword(email, pass)

export const resetPassword = (email) => auth().sendPasswordResetEmail(email)

export const verifyEmail = () => auth().currentUser.sendEmailVerification()

// TODO FIX SIGNUP PROCESS
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
// TODO add provider signup
// export const signupwithProvider = ({
//     email,
//     password,
//     accountType,
//     displayName
// }) => {
//     if (!accountTypes.includes(accountType)) {
//         return false
//     }

//     auth.currentUser.linkWithPopup(provider).then(function (result) {
//         // Accounts successfully linked.
//         var credential = result.credential;
//         var user = result.user;
//         // ...
//     }).catch(function (error) {
//         // Handle Errors here.
//         // ...
//     });
//     return auth().createUserWithEmailAndPassword(email, password)
//         .then(user => saveUser(user, accountType, displayName))
// }

export const saveUser = (user, accountType, displayName) => {
    if (!accountType || !displayName || !user) {
        return logout()
    }
    // const newUser = {
    //     displayName,
    //     accountType,
    //     email: user.email,
    //     photoURL: user.photoURL,
    //     uid: user.uid,
    // }
    
    return user.updateProfile({
        displayName,
        accountType
    }).then(() => createUser({
        displayName,
        accountType,
        uid: user.uid
    }, res => {
        console.log('createUser res ==== ', res)
        debugger
    }))
}