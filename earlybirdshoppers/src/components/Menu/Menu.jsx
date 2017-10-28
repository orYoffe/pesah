import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../helpers/auth'
import { logout as logoutAction } from '../../reducers/auth'
import LocalePicker from './LocalePicker'
import './Menu.css'

class Menu extends Component {

    logout = () => {
        logout().then(() => logoutAction())
    }
    renderDynamicLinks = () => {
        const { isLoggedIn, id, accountType, trans } = this.props
        const isFan = accountType === 'fan'
        const links = []
        if (isLoggedIn && id) {
            if (!isFan) {
                links.push(
                    <li key={`menu_item_${id}_page`}>
                        <NavLink className="nav-link" data-toggle="collapse" to={`/${accountType}/${id}`}>{trans.My_Page}</NavLink>
                    </li>
                )
                links.push(
                    <li key={`menu_item_${id}_create_event`}>
                        <NavLink className="nav-link" data-toggle="collapse" to="/create-event">{trans.Create_Event} +</NavLink>
                    </li>
                )
            }
            links.push(
                <li key={`menu_item_${id}_logout`}>
                    <NavLink className="nav-link" data-toggle="collapse" to="/" onClick={this.logout}>{trans.Logout}</NavLink>
                </li>
            )
        } else {
            links.push(
                <li key={`menu_item_01_signup`}>
                    <NavLink className="nav-link" data-toggle="collapse" to="/signup">{trans.Signup}</NavLink>
                </li>
            )
            links.push(
                <li key={`menu_item_02_login`}>
                    <NavLink className="nav-link" data-toggle="collapse" to="/login">{trans.Login}</NavLink>
                </li>
            )
        }

        return links
    }

    render() {
        
        const { trans } = this.props

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
                        <NavLink className="navbar-brand" data-toggle="collapse" to="/">Raise The Bar</NavLink>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li>
                                <NavLink className="nav-link" data-toggle="collapse" to="/">{trans.Explore}</NavLink>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            {this.renderDynamicLinks()}
                            <li>
                                <LocalePicker />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    if (state.auth.user) {
        return {
            isLoggedIn: state.auth.loggedIn,
            accountType: state.auth.user.accountType,
            id: state.auth.user.uid,
            trans: state.locale.trans,
        }
    }

    return {
        isLoggedIn: state.auth.loggedIn,
        accountType: false,
        id: false,
        trans: state.locale.trans,
    }
}
export default connect(mapStateToProps)(Menu)