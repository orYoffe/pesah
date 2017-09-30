import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../helpers/auth'
import { login as loginAction } from '../reducers/auth'
import './Login.css'

class Login extends Component {
    state = {
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

    setAccountDetails = (value) => {
        if (!!value && this.state.accountDetails.value !== value) {
            this.setState({ accountDetails: { value }})
        }
    }
    setSignInButtonText = (value) => {
        if (!!value && this.state.signIn.value !== value) {
            this.setState({
                signIn: { value, disabled: this.state.signIn.disabled }
            })
        }
    }

    signIn = (e) => {
        e && e.preventDefault()
        e && e.stopPropagation()
        
            const email = this.state.email.value
            const password = this.state.pass.value
            if (email.length < 4) {
                this.setMessage('error', 'Please enter an email address.')
                return false
            }
            if (password.length < 4) {
                this.setMessage('error', 'Please enter a password.')
                return false
            }
            login(email, password)
            .then(user => this.props.login(user))
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                if (errorCode === 'auth/wrong-password') {
                    this.setMessage('error', 'Wrong password.')
                } else {
                    this.setMessage('error', errorMessage)
                }
                console.log(error)
            })
        return false
    }

    render() {
        const { messages: { message, error } } = this.state

        return (
            <div className="Login">
                <h2>Sign In</h2>
                <form onSubmit={this.signIn}>
                    <label htmlFor="email">Email:</label>
                    <input
                        style={{display: 'inline', width: 'auto'}}
                        type="text"
                        onChange={this.emailChange}
                        id="email"
                        name="email"
                        placeholder="example@example.com"
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        style={{display: 'inline', width: 'auto'}}
                        type="password"
                        onChange={this.passChange}
                        id="password"
                        name="password"
                        placeholder="Password"
                    />
                    <input
                        className="button"
                        onClick={this.signIn}
                        id="sign-in"
                        type="submit"
                        name="signin"
                        value="Sign In"
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
                <p>Don't have a User? Sign up <Link to="signup">here</Link></p>
            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return { login: (user) => dispatch(loginAction(user)) }
}

export default connect(() => ({}), mapDispatchToProps)(Login)
