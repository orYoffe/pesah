import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../helpers/auth'
import { logout as logoutAction } from '../reducers/auth'
import './Menu.css'

class Menu extends Component {

    logout = () => {
        logout().then(() => logoutAction())
    }

    render() {
        const { isLoggedIn } = this.props
        return (
            <div className="navbar navbar-default navbar-fixed-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <NavLink className="navbar-brand" to="/">Raise The Bar</NavLink>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                {isLoggedIn ? 
                                    <NavLink className="nav-link" to="/" onClick={this.logout}>Logout</NavLink> :
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                }
                            </li>
                        </ul>
                        <ul className="nav navbar-nav">
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { isLoggedIn: state.auth.loggedIn }
}
export default connect(mapStateToProps)(Menu)