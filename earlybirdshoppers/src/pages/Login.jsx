import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../helpers/auth'
import { login as loginAction } from '../reducers/auth'
import { pageView } from '../helpers/analytics'

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
            // .then(user => this.props.login(user))
            login(email, password)
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

    componentDidMount() {
        pageView();
    }

    render() {
        const { messages: { message, error } } = this.state
        
        if (this.props.isLoggedIn) {
            return  <Redirect to='/'/>
        }

        return (
            <div className="Login container">
                <h2>Login</h2>
                <form onSubmit={this.signIn}>
                    <label htmlFor="email">Email:</label>
                    <input
                    className="form-control"
                        type="text"
                        onChange={this.emailChange}
                        id="email"
                        name="email"
                        placeholder="example@example.com"
                    />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input
                        className="form-control"
                        type="password"
                        onChange={this.passChange}
                        id="password"
                        name="password"
                        placeholder="Password"
                    />
                    <br />
                    <input
                        className="btn btn-primary form-control"
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
                <br />
                <p>Forgot your password? Reset your password <Link to="/password-reset">here</Link></p>

                <br />
                <input
                    className="btn btn-primary"
                    type="button"
                    value="Connect with FB (unfunctional)"
                />
                <br />
                <input
                    className="btn btn-primary"
                    type="button"
                    value="Connect with google (unfunctional)"
                />
                <br />
                <input
                    className="btn btn-primary"
                    type="button"
                    value="Connect with twitter (unfunctional)"
                />

                <br />
                <br />
                <p>Don't have a User? Sign up <Link to="signup">here</Link></p>
            </div>

        )
    }
}

const mapDispatchToProps = dispatch => ({ login: (user) => dispatch(loginAction(user)) })

const mapStateToProps = state => ({isLoggedIn: state.auth.loggedIn})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
