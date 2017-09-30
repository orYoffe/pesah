import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signup } from '../helpers/auth'
import { Link } from 'react-router-dom'
import { login as loginAction } from '../reducers/auth'
import './Login.css'

class Signup extends Component {
    state = {
        loggedIn: false,
        email: {
            value: '',
        },
        pass: {
            value: '',
        },
        messages: {
            error: '',
            message: ''
        }
    }

    setMessage = (type, newMessage) => {
        const { messages: { error, message } } = this.state
        if (type === 'error') {
            if (error !== newMessage) {
                this.setState({ messages: { error: newMessage, message: '' }})
            }
        } else if (type === 'message') {
            if (message !== newMessage) {
                this.setState({ messages: { message: newMessage, error: '' }})
            }
        }
    }

    emailChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.email.value !== value) {
            this.setState({ email: { value }})
        }
    }

    passChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.pass.value !== value) {
            this.setState({ pass: { value }})
        }
    }

    handleSignUp = (e) => {
        e && e.preventDefault()
        e && e.stopPropagation()
        const email = this.state.email.value
        const password = this.state.pass.value
        if (email.length < 4) {
            this.setMessage('error', 'Please enter an email address.')
            return
        }
        if (password.length < 4) {
            this.setMessage('error', 'Please enter a password.')
            return
        }
        signup(email, password)
        .then(user => this.props.login(user))
        .catch((error) => {
            const errorMessage = error.message
            this.setMessage('error', errorMessage)
            console.log(error)
        })
    }

    render() {
        const { messages: { message, error } } = this.state

        return (
            <div className="Login">
                <h2>Sign up</h2>
                <form onSubmit={this.handleSignUp}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        onChange={this.emailChange}
                        id="email"
                        name="email"
                        placeholder="example@example.com"
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        onChange={this.passChange}
                        id="password"
                        name="password"
                        placeholder="Password"
                    />
                    <input
                        className="button"
                        onClick={this.handleSignUp}
                        id="sign-in"
                        type="submit"
                        value="Sign up"
                    />
                </form>
                {!!error && <br/>}
                {!!error && <div style={{color: '#f00'}}>{error}</div>}
                {!!message && <br/>}
                {!!message && <div>{message}</div>}

                <br />
                <input
                    className="button"
                    type="button"
                    value="Connect with FB (unfunctional)"
                />
                <input
                    className="button"
                    type="button"
                    value="Connect with google (unfunctional)"
                />
                <input
                    className="button"
                    type="button"
                    value="Connect with twitter (unfunctional)"
                />

                <br />
                <p>Already have a User? Log in <Link to="login">here</Link></p>
            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return { login: (user) => dispatch(loginAction(user)) }
}

export default connect(() => ({}), mapDispatchToProps)(Signup)
