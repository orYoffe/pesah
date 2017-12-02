import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({component: Component, isLoggedIn, isAdmin, isRouteForAdmin, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => isLoggedIn === true && (!isRouteForAdmin || isAdmin)
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.loggedIn,
  isAdmin: state.auth.user && state.auth.user.isAdmin,
})

export default connect(mapStateToProps)(PrivateRoute)
