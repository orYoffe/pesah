import { auth, createUser
    // googleProvider, fbProvider
} from './firebase'
const accountTypes = ['musician', 'venueManager']

export const logout = () => auth().signOut()

export const login = (email, pass) => auth().signInWithEmailAndPassword(email, pass)

export const resetPassword = (email) => auth().sendPasswordResetEmail(email)

export const verifyEmail = () => auth().currentUser.sendEmailVerification()

export const signup = ({
    email,
    password,
    accountType,
    displayName,
    firstname,
    lastname,
    location,
    seatingCapacity,
    standingCapacity,
    profileUrl,
}) => {
    if (!accountTypes.includes(accountType)) {
        return false
    }
    return auth().createUserWithEmailAndPassword(email, password)
        .then(user => saveUser(
            user,
            accountType,
            displayName,
            firstname,
            lastname,
            location,
            seatingCapacity,
            standingCapacity,
            profileUrl,
        ))
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

export const saveUser = (
    user,
    accountType,
    displayName,
    firstname,
    lastname,
    location,
    seatingCapacity,
    standingCapacity,
    profileUrl,
) => {
    if (!accountType || !displayName || !user || !firstname || !lastname) {
        return logout()
    }
    // const newUser = {
    //     displayName,
    //     accountType,
    //     email: user.email,
    //     photoURL: user.photoURL,
    //     uid: user.uid,
    // }
    verifyEmail() // TODO move to BE
    return user.updateProfile({
        displayName
    }).then(() => createUser({
        displayName,
        accountType,
        firstname,
        lastname,
        uid: user.uid,
        location,
        seatingCapacity,
        standingCapacity,
        profileUrl,
    }, res => {
        if (!res || res.code !== 200 || res.message !== 'ok') {
            logout()
        }
        console.log('createUser res ==== ', res)
        return res
    }))
}
