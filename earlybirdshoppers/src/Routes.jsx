import React from 'react'
import { connect } from 'react-redux'
import {
    BrowserRouter as Router,
    Route,
    Link,
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
import NotFound from './pages/NotFound'

const Routes = (props) => (
    <Router>
        <div>
            <ul>
                <li><Link to="/">Explore</Link></li>
                <li><Link to="/artist">Artist</Link></li>
                <li><Link to="/venue">Venue</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>

            <hr/>

            <Switch>
                <Route exact path="/realhtml_186231treg.html" component={Explore}/>
                <Route exact path="/" component={Explore}/>
                <Route exact path="/artist" component={Artist}/>
                <Route exact path="/venue" component={Venue}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/signup" component={SignUp}/>
                {/*<PublicRoute authed={this.state.authed} path='/login' component={Login} />*/}
                {/*<PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />*/}
                <Route path="/404" component={NotFound}/>
                <Redirect to="/404" />
            </Switch>
        </div>
    </Router>
)

function mapStateToProps(state) {
    return { auth: state.auth.loggedIn }
}

export default connect(mapStateToProps)(Routes)
