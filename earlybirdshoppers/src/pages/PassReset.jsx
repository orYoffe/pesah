import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from '../helpers/firebase'
import './Login.css'

class Login extends Component {
    state = {
        loggedIn: false,
        email: {
            value: '',
        },
        pass: {
            value: '',
        },
        accountDetails: {
            value: 'null',
        },
        signInStatus: {
            value: 'Unknown',
        },
        signIn: {
            value: 'Sign In',
            disabled: false
        },
        verifyEmail: {
            disabled: true
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
    setSignInStatus = (value) => {
        if (!!value && this.state.signInStatus.value !== value) {
            this.setState({ signInStatus: { value }})
        }
    }
    setSignInButtonText = (value) => {
        if (!!value && this.state.signIn.value !== value) {
            this.setState({
                signIn: { value, disabled: this.state.signIn.disabled }
            })
        }
    }
    setSignInButtonDisableState = (value) => {
        if (this.state.signIn.disabled !== value) {
            this.setState({
                signIn: { disabled: value, value: this.state.signIn.value }
            })
        }
    }
    setVerifyEmailDisableState = (value) => {
        if (this.state.verifyEmail.disabled !== value) {
            this.setState({ verifyEmail: { disabled: value }})
        }
    }

    toggleSignIn = () => {
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
                this.setSignInButtonDisableState(false)
            })
        }
        this.setSignInButtonDisableState(true)
    }

    handleSignUp = () => {
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
        firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            if (errorCode === 'auth/weak-password') {
                this.setMessage('error', 'The password is too weak.')
            } else {
                this.setMessage('error', errorMessage)
            }
            console.log(error)
        })
    }

    sendEmailVerification = () => {
        firebase.auth().currentUser.sendEmailVerification().then(() => {
            this.setMessage('message', 'Email Verification Sent!')
        })
    }
    sendPasswordReset = () => {
        const email = this.state.email.value
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            this.setMessage('message', 'Password Reset Email Sent!')
        }).catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            if (errorCode === 'auth/invalid-email') {
                this.setMessage('error', errorMessage)
            } else if (errorCode === 'auth/user-not-found') {
                this.setMessage('error', errorMessage)
            }
            console.log(error)
        })
    }
    
    checkAuthState = (user) => {
        this.setVerifyEmailDisableState(true)
        if (user) {
            debugger
            // const displayName = user.displayName
            // const email = user.email
            const emailVerified = user.emailVerified
            // const photoURL = user.photoURL
            // const isAnonymous = user.isAnonymous
            // const uid = user.uid
            // const providerData = user.providerData
            this.setSignInStatus('Signed in')
            this.setSignInButtonText('Sign out')
            this.setAccountDetails(JSON.stringify(user, null, '  '))
            if (!emailVerified) {
                this.setVerifyEmailDisableState(false)
            }
            this.setState({ loggedIn: true })
        } else {
            // User is signed out.
            this.setSignInStatus('Signed out')
            this.setSignInButtonText('Sign in')
            this.setAccountDetails('null')
            this.setState({ loggedIn: false })

        }
        this.setSignInButtonDisableState(false)
    }
    initLogin = () => {
        firebase.auth().onAuthStateChanged(this.checkAuthState)
        const user = firebase.auth().currentUser
        if (user) {
            this.checkAuthState(user)
        }
    }

    componentDidMount() {
        if (typeof firebase !== 'undefined' && !this.initialized) {
            this.initialized = true
            this.initLogin()
        }
    }
    componentWillUpdate() {
        if (typeof firebase !== 'undefined' && !this.initialized) {
            this.initialized = true
            this.initLogin()
        }
    }

    render() {
        const { accountDetails, signIn, verifyEmail, signInStatus,
            messages: { message, error }, loggedIn } = this.state

        return (
            <div className="Login">
                <h2 className="mdl-card__title-text">{signIn.value}</h2>
                <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                    {!loggedIn &&
                        <p>Enter an email and password below and either sign in to an existing account or sign up</p>}
                        {!loggedIn && <input className="mdl-textfield__input"
                            style={{display: 'inline', width: 'auto'}}
                            type="text"
                            onChange={this.emailChange}
                            id="email"
                            name="email"
                            placeholder="Email"
                        />}
                        {!loggedIn && <input
                            className="mdl-textfield__input"
                            style={{display: 'inline', width: 'auto'}}
                            type="password"
                            onChange={this.passChange}
                            id="password"
                            name="password"
                            placeholder="Password"
                        />
                    }
                    <br/><br/>
                    <button
                        disabled={signIn.disabled}
                        className="button"
                        onClick={this.toggleSignIn}
                        id="sign-in"
                        name="signin"
                    >
                        {signIn.value}
                    </button>
                    {!loggedIn && <button
                        className="button"
                        onClick={this.handleSignUp}
                        id="sign-up"
                        name="signup"
                    >
                        Sign Up
                    </button>}
                    {!loggedIn && <button
                        className="button"
                        onClick={this.sendEmailVerification}
                        disabled={verifyEmail.disabled}
                        id="verify-email"
                        name="verify-email"
                    >
                        Send Email Verification
                    </button>}
                    {!loggedIn && <button
                        className="button"
                        onClick={this.sendPasswordReset}
                        id="password-reset"
                        name="verify-email"
                    >
                        Send Password Reset Email
                    </button>}

                    {!!error && <br/>}
                    {!!error && <div style={{color: '#f00'}}>{error}</div>}
                    {!!message && <br/>}
                    {!!message && <div>{message}</div>}
                    <br/><br/>


                    <div className="user-details-container">
                        Firebase sign-in status: <span id="sign-in-status">{signInStatus.value}</span>
                        <div>Firebase auth <code>currentUser</code> object value:</div>
                        <pre><code id="account-details">{accountDetails.value}</code></pre>
                    </div>
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return { firebase: state.config.firebase }
}
export default connect(mapStateToProps)(Login)
