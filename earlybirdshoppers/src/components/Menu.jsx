import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

class Menu extends Component {

    render() {
        const { isLoggedIn } = this.props
        console.log('Menu this.props',this.props)
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                <NavLink className="navbar-brand" to="/">Raise The Bar</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Explore</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/artist">Artist</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/venue">Venue</NavLink>
                        </li>
                        <li className="nav-item">
                            {isLoggedIn ? 
                                <NavLink className="nav-link" to="/logout">Logout</NavLink> :
                                <NavLink className="nav-link" to="/login">Login</NavLink>
                            }
                        </li>
                    </ul>
                    {/*<form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>*/}
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    return { isLoggedIn: state.auth.loggedIn }
}
export default connect(mapStateToProps)(Menu)