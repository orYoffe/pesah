import React, { Component } from 'react'
import firebase, { getUser } from './helpers/firebase'
import { connect } from 'react-redux'
import { login, logout } from './reducers/auth'
import { configInit } from './reducers/config'
import { setMapsIsReady } from './reducers/locale'
import Routes from './Routes'
import Loader from './components/Loader/'

class App extends Component {
  state = {
    loading: true
  }
  constructor(props){
    super(props);
    props.dispatch(configInit(firebase))

    window.mapsInit = () => {
      props.dispatch(setMapsIsReady(true))
    }
  }

  componentDidMount () {
    const { dispatch } = this.props
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user && user.uid) {
        getUser(user.uid, snapshot => {
          const userData = snapshot.val()
          userData.profilePicture = userData.photoURL || user.photoURL
          dispatch(login(userData))
          this.setState({ loading: false })
        })
      } else {
        dispatch(logout())
        this.setState({ loading: false })
      }
    })
  }
  componentWillUnmount() {
    this.removeListener()
  }

  render() {
    if (this.state.loading) return <Loader />
    return <Routes />
  }
}

export default connect()(App)