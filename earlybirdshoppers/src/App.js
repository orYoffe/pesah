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
        console.log('user ======== ', user)
        dispatch(login({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          providerData: user.providerData,
          displayName: user.displayName,
          accountType: user.accountType,
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
    const { isAdmin, isLoggedIn } = this.props
    if (this.state.loading) return <Loader />
    return <Routes isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.loggedIn,
  isAdmin: state.auth.user && state.auth.user.isAdmin,
})

export default connect(mapStateToProps)(App)
