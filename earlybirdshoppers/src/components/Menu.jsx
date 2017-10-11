import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl';
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
            <li key={`menu_item_${id}_page`}>
                <NavLink className="nav-link" to={isArtist ? `/artist/${id}` : `/venue/${id}`}>My Page</NavLink>
            </li>,
            <li key={`menu_item_${id}_logout`}>
                <NavLink className="nav-link" to="/" onClick={this.logout}><FormattedMessage defaultMessage="Logout" /></NavLink>
            </li>,
        ]) : ([
            <li key={`menu_item_01_signup`}>
                <NavLink className="nav-link" to="/signup">Signup</NavLink>
            </li>,
            <li key={`menu_item_02_login`}>
                <NavLink className="nav-link" to="/login">Login</NavLink>
            </li>,
        ])
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
                            {navButtons}
                        </ul>
                        <ul className="nav navbar-nav">
                            <li>
                                <NavLink className="nav-link" to="/">Explore</NavLink>
                            </li>
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