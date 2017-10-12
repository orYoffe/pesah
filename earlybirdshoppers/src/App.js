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

  render = () => <Routes isLoggedIn={this.props.isLoggedIn} />
}

const mapStateToProps = state => ({ isLoggedIn: state.auth.loggedIn })

export default connect(mapStateToProps)(App)
