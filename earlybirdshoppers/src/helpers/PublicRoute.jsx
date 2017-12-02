import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PublicRoute = ({component: Component, authed, isLoggedIn, ...rest}) => (
  <Route
    {...rest}
    render={(props) => !isLoggedIn
      ? <Component {...props} />
      : <Redirect to='/' />}
  />
)

const mapStateToProps = state => ({
  isLoggedIn: state.auth.loggedIn,
})

export default connect(mapStateToProps)(PublicRoute)
