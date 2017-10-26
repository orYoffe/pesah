import { combineReducers } from 'redux'
import auth from './auth'
import config from './config'
import locale from './locale'
import chat from './chat'

export default combineReducers({
  auth,
  config,
  locale,
  chat,
})
