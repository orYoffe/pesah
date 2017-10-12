import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../helpers/auth'
import { logout as logoutAction } from '../../reducers/auth'
import { setLocale } from '../../reducers/locale'
import { locales } from '../../translations'
import './Menu.css'

class Menu extends Component {

    logout = () => {
        logout().then(() => logoutAction())
    }

    onSelect = (e) => this.props.setLocale(e.target.value)

    render() {
        const { isLoggedIn, id, accountType, trans, currentLocale } = this.props
        const isFan = accountType === 'fan'
        const navButtons = isLoggedIn && id ? ([
            !isFan && (<li key={`menu_item_${id}_page`}>
                <NavLink className="nav-link" to={`/${accountType}/${id}`}>{trans.My_Page}</NavLink>
            </li>),
            !isFan && (<li key={`menu_item_${id}_create_event`}>
                <NavLink className="nav-link" to="/create-event">{trans.Create_Event}</NavLink>
            </li>),
            <li key={`menu_item_${id}_logout`}>
                <NavLink className="nav-link" to="/" onClick={this.logout}>{trans.Logout}</NavLink>
            </li>,
        ]) : ([
            <li key={`menu_item_01_signup`}>
                <NavLink className="nav-link" to="/signup">{trans.Signup}</NavLink>
            </li>,
            <li key={`menu_item_02_login`}>
                <NavLink className="nav-link" to="/login">{trans.Login}</NavLink>
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
                        <ul className="nav navbar-nav">
                            <li>
                                <NavLink className="nav-link" to="/">{trans.Explore}</NavLink>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            {navButtons}
                            <li>
                                <select onChange={this.onSelect} defaultValue={currentLocale} className="form-control" to="/">
                                    {locales.map(locale => (
                                        <option
                                        value={locale}
                                        key={locale}>{locale}</option>
                                    ))}
                                </select>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.loggedIn,
        accountType: state.user && state.user.accountType,
        id: state.auth.user && state.auth.user.uid,
        trans: state.locale.trans,
        currentLocale: state.locale.currentLocale,
    }
}
const mapDispatchToProps = (dispatch) => ({
        setLocale: locale => dispatch(setLocale(locale)),
    })
export default connect(mapStateToProps, mapDispatchToProps)(Menu)