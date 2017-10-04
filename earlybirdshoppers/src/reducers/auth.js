import { auth } from '../helpers/firebase'

const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const SIGNUP = 'SIGNUP'
const RESET_PASS = 'RESET_PASS'
const VERIFY_EMAIL = 'VERIFY_EMAIL'

export const verifyEmail = () => ({
  type: VERIFY_EMAIL
})
export const resetPassword = () => ({
  type: RESET_PASS
})
export const signup = (user) => ({
  type: SIGNUP,
  user
})
export const login = (user) => ({
  type: LOGIN,
  user
})
export const logout = () => ({
  type: LOGOUT
})

const initialState = {
  loggedIn: false,
  user: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SIGNUP':
    case 'LOGIN':
      console.log(auth().currentUser)
      let user
      const currentUser = auth().currentUser
      if (state.user && currentUser) {
        user = { ...state.user, ...currentUser, ...action.user }
      } else if (currentUser) {
        user = { ...currentUser, ...action.user }
      } else if (state.user) {
        user = { ...state.user, ...action.user }
      } else {
        user = action.user
      }
      debugger
      return {
        ...state,
        loggedIn: true,
        user,
      }
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false,
        user: false,
      }
    default:
      return state
  }
}
