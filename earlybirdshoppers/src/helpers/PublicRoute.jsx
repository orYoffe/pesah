import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PublicRoute = ({component: Component, authed, ...rest}) => (
  <Route
    {...rest}
    render={(props) => authed === false
      ? <Component {...props} />
      : <Redirect to='/' />}
  />
)

export default PublicRoute
