const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'

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
