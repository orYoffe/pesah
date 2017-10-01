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
        const { isLoggedIn, id, isArtist } = this.props
        const navButtons = isLoggedIn && id ? ([
            <NavLink className="nav-link" key={`menu_item_${id}_page`} to={isArtist ? `/artist/${id}` : `/venue/${id}`}>My Page</NavLink>,
            <NavLink className="nav-link" key={`menu_item_${id}_logout`} to="/" onClick={this.logout}>Logout</NavLink>
        ]) : (<NavLink className="nav-link" to="/login">Login</NavLink>)
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
                                {navButtons}
                            </li>
                        </ul>
                        <ul className="nav navbar-nav">
                            <NavLink className="nav-link" to="/">Explore</NavLink>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.auth.loggedIn,
        isArtist: state.auth.isArtist,
        id: state.auth.user && state.auth.user.uid,
    }
}
export default connect(mapStateToProps)(Menu)