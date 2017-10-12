import { combineReducers } from 'redux'
import auth from './auth'
import config from './config'
import locale from './locale'

export default combineReducers({
  auth,
  config,
  locale,
})
