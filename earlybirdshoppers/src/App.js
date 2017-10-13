import React, { Component } from 'react'
import firebase, { getUser } from './helpers/firebase'
import { connect } from 'react-redux'
import { login, logout } from './reducers/auth'
import { configInit } from './reducers/config'
import Routes from './Routes'
import Loader from './components/Loader/'


class App extends Component {
  state = {
    loading: true
  }
  constructor(props){
    super(props);
    props.dispatch(configInit(firebase))
  }

  componentDidMount () {
    const { dispatch } = this.props
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user && user.uid) {
        dispatch(login({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          providerData: user.providerData,
        }))

        getUser(user.uid, snapshot => dispatch(login(snapshot.val())))
      } else {
        dispatch(logout())
      }
      this.setState({ loading: false })
    })
  }
  componentWillUnmount() {
    this.removeListener()
  }

  render() {
    if (this.state.loading) return <Loader />
    return <Routes isLoggedIn={this.props.isLoggedIn} />
  }
}

const mapStateToProps = state => ({ isLoggedIn: state.auth.loggedIn })

export default connect(mapStateToProps)(App)
