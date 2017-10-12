import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import PassReset from './pages/PassReset'
import PrivateRoute from './helpers/PrivateRoute'
import PublicRoute from './helpers/PublicRoute'
import Explore from './pages/Explore'
import Artist from './pages/Artist'
import Venue from './pages/Venue'
import Event from './pages/Event'
import Fan from './pages/Fan'
import NotFound from './pages/NotFound'
import Menu from './components/Menu'

const Routes = (props) => (
        <Router>
            <div className="root">
                <div className="container">
                    <div className="row">
                        <Menu />

                        <Switch>
                            <Route exact path="/realhtml_186231treg.html" component={Explore}/>
                            <Route exact path="/" component={Explore}/>
                            <PublicRoute exact path="/login" authed={props.isLoggedIn} component={Login}/>
                            <PublicRoute exact path="/signup" authed={props.isLoggedIn} component={SignUp}/>
                            <Route exact path="/password-reset" component={PassReset}/>
                            <Route path="/artist/:id" component={Artist}/>
                            <Route path="/venue/:id" component={Venue}/>
                            <Route path="/event/:id" component={Event}/>
                            <Route path="/fan/:id" component={Fan}/>
                            {/*<PublicRoute authed={this.state.authed} path='/login' component={Login} />*/}
                            {/*<PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />*/}
                            <Route path="/404" component={NotFound}/>
                            <Redirect to="/404" />
                        </Switch>
                    </div>
                </div>
            </div>
        </Router>
)

export default Routes
