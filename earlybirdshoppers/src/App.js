import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom'
import Login from './pages/Login'
import Explore from './pages/Explore'
import Artist from './pages/Artist'
import Venue from './pages/Venue'
import NotFound from './pages/NotFound'
import './App.css'

class App extends Component {
    render() {
        return (
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
                        <Route path="/404" component={NotFound}/>
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App
