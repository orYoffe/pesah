const CONFIG_INIT = 'CONFIG_INIT'

export const configInit = (firebase) => ({
  type: CONFIG_INIT,
  firebase
})

export default (state = {
  firebase: false
}, action) => {
  switch (action.type) {
    case 'CONFIG_INIT':
      return {
        firebase: action.app
      }
    default:
      return state
  }
}
