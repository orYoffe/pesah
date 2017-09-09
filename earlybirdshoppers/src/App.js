/* global firebase */
import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import Login from './pages/Login'
import Explore from './pages/Explore'
import Artist from './pages/Artist'
import Venue from './pages/Venue'
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

                    <Route exact path="/" component={Explore}/>
                    <Route path="/artist" component={Artist}/>
                    <Route path="/venue" component={Venue}/>
                    <Route path="/login" component={Login}/>
                </div>
            </Router>
        )
    }
}

export default App
