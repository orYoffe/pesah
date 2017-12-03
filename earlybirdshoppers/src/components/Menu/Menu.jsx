import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../helpers/auth'
import { logout as logoutAction } from '../../reducers/auth'
import ChatRooms from '../ChatRooms'
import LocalePicker from './LocalePicker'
import './Menu.css'

class Menu extends Component {
    state = {
        isOpen: false
    }

    toggleMenu = () => this.setState({ isOpen: !this.state.isOpen })
    closeMenu = () => this.state.isOpen && this.toggleMenu()
    logout = () => {
        this.closeMenu()
        logout().then(() => logoutAction())
    }
    renderDynamicLinks = () => {
        const { isLoggedIn, userUid, accountType, trans, isAdmin } = this.props
        // const isFan = accountType === 'fan'
        const links = []
        if (isLoggedIn && userUid) {
            // if (!isFan) {
                links.push(
                    <li key={`menu_item_${userUid}_page`}>
                        <NavLink  onClick={this.closeMenu}  to={`/${accountType}/${userUid}`}>{trans.My_Page}</NavLink>
                    </li>
                )
                links.push(
                    <li key={`menu_item_${userUid}_create_event`}>
                        <NavLink  onClick={this.closeMenu}  to="/create-event">{trans.Create_Event} +</NavLink>
                    </li>
                )
            // }
            if (isAdmin) {
                links.push(
                    <li key={`menu_item_${userUid}_admin_pannel`}>
                        <NavLink  onClick={this.closeMenu}to="/admin">{trans.Admin_pannel}</NavLink>
                    </li>
                )
            }
            links.push(
                <li key={`menu_item_${userUid}_logout`}>
                    <NavLink to={"/"} onClick={this.logout}>{trans.Logout}</NavLink>
                </li>
            )
        } else {
            links.push(
                <li key={`menu_item_01_signup`}>
                    <NavLink  onClick={this.closeMenu}  to="/signup">{trans.Signup}</NavLink>
                </li>
            )
            links.push(
                <li key={`menu_item_02_login`}>
                    <NavLink  onClick={this.closeMenu}  to="/login">{trans.Login}</NavLink>
                </li>
            )
        }

        return links
    }

    render() {

        const { trans, isLoggedIn } = this.props
        const { isOpen } = this.state

        return (
            <div className="navbar navbar-default navbar-fixed-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle"  onClick={this.toggleMenu}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <NavLink  onClick={this.closeMenu} className="navbar-brand"  to={"/"}>Raise The Bar</NavLink>
                        {isLoggedIn && <ChatRooms />}
                    </div>
                    <div className={`collapse ${isOpen ? 'in' : ''} navbar-collapse`}>
                        <ul className="nav navbar-nav">
                            {/*<li>
                                <NavLink  onClick={this.closeMenu}  to={"/"}>{trans.Explore}</NavLink>
                            </li>*/}
                            <li>
                                <NavLink  onClick={this.closeMenu}  to={"/venues"}>{trans.Venues}</NavLink>
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
            userUid: state.auth.user.uid,
            trans: state.locale.trans,
            isAdmin: state.auth.user.isAdmin,
        }
    }

    return {
        isLoggedIn: state.auth.loggedIn,
        accountType: false,
        userUid: false,
        isAdmin: false,
        trans: state.locale.trans,
    }
}
export default connect(mapStateToProps)(Menu)
