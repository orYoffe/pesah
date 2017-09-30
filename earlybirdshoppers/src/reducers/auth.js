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

export default (state = {
  loggedIn: false,
  user: false
}, action) => {
  switch (action.type) {
    case 'SIGNUP':
      return {
        loggedIn: true,
        user: action.user
      }
    case 'LOGIN':
      return {
        loggedIn: true,
        user: action.user
      }
    case 'LOGOUT':
      return {
        loggedIn: false,
        user: false
      }
    default:
      return state
  }
}
