import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import firebase from '../helpers/firebase'
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

    toggleSignIn = (e) => {
        e && e.prevetDefault()
        e && e.stopPropagation()
        if (firebase.auth().currentUser) {
            firebase.auth().signOut()
        } else {
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
            firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                if (errorCode === 'auth/wrong-password') {
                    this.setMessage('error', 'Wrong password.')
                } else {
                    this.setMessage('error', errorMessage)
                }
                console.log(error)
            })
        }
    }


    sendEmailVerification = () => {
        firebase.auth().currentUser.sendEmailVerification().then(() => {
            // this.setMessage('message', 'Email Verification Sent!')
        })
    }

    checkAuthState = (user) => {
        if (user) {
            // const displayName = user.displayName
            // const email = user.email
            const emailVerified = user.emailVerified
            // const photoURL = user.photoURL
            // const isAnonymous = user.isAnonymous
            // const uid = user.uid
            // const providerData = user.providerData
            if (!emailVerified) {
                this.sendEmailVerification()
            }
        } else {
            // User is signed out.
        }
    }
    initLogin = () => {
        if (typeof firebase !== 'undefined' && !this.initialized) {
            this.initialized = true
            firebase.auth().onAuthStateChanged(this.checkAuthState)
            const user = firebase.auth().currentUser
            if (user) {
                this.checkAuthState(user)
            }
        }
    }

    componentDidMount() {
        this.initLogin()
    }
    componentWillUpdate() {
        this.initLogin()
    }

    render() {
        const { messages: { message, error } } = this.state

        return (
            <div className="Login">
                <h2 className="mdl-card__title-text">Sign In</h2>
                <form onSubmit={this.toggleSignIn}>
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
                        onClick={this.toggleSignIn}
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

function mapStateToProps(state) {
    return { firebase: state.config.firebase }
}
export default connect(mapStateToProps)(Login)
