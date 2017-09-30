import React, { Component } from 'react'
import firebase from './helpers/firebase'
import { connect } from 'react-redux'
import { login, logout } from './reducers/auth'
import { configInit } from './reducers/config'
import Routes from './Routes'


class App extends Component {
  constructor(props){
    super(props);
    props.dispatch(configInit(firebase))
    // this.database = firebase.database().ref().child('Artists');

    // We're going to setup the React state of our component
    // this.state = {
    //   notes: [],
    // }
  }

  componentDidMount () {
    const { dispatch } = this.props
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(login(user))
      } else {
        dispatch(logout())
      }
    })
  }
  componentWillUnmount() {
    this.removeListener()
  }

  render = () => <Routes />
}

export default connect()(App)
