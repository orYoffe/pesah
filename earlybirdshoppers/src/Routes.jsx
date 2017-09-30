import React from 'react'
import { connect } from 'react-redux'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
// import PrivateRoute from './helpers/PrivateRoute'
// import PublicRoute from './helpers/PublicRoute'
import Explore from './pages/Explore'
import Artist from './pages/Artist'
import Venue from './pages/Venue'
import Event from './pages/Event'
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
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/signup" component={SignUp}/>
                        <Route path="/artist/:id" component={Artist}/>
                        <Route path="/venue/:id" component={Venue}/>
                        <Route path="/event/:id" component={Event}/>
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

function mapStateToProps(state) {
    return { auth: state.auth.loggedIn }
}

export default connect(mapStateToProps)(Routes)
