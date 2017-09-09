/* global firebase */
import React, { Component } from 'react'

class Login extends Component {
    state = {
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
            this.setState({ signIn: { value }})
        }
    }
    setSignInButtonDisableState = (value) => {
        if (this.state.signIn.disabled !== value) {
            this.setState({ signIn: { disabled: value }})
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
                alert('Please enter an email address.')
                return
            }
            if (password.length < 4) {
                alert('Please enter a password.')
                return
            }
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                const errorCode = error.code
                const errorMessage = error.message
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.')
                } else {
                    alert(errorMessage)
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
            alert('Please enter an email address.')
            return
        }
        if (password.length < 4) {
            alert('Please enter a password.')
            return
        }
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            const errorCode = error.code
            const errorMessage = error.message
            if (errorCode === 'auth/weak-password') {
                alert('The password is too weak.')
            } else {
                alert(errorMessage)
            }
            console.log(error)
        })
    }

    sendEmailVerification = () => {
        firebase.auth().currentUser.sendEmailVerification().then(function() {
            alert('Email Verification Sent!')
        })
    }
    sendPasswordReset = () => {
        const email = this.state.email.value
        // [START sendpasswordemail]
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            // Password Reset Email Sent!
            // [START_EXCLUDE]
            alert('Password Reset Email Sent!')
            // [END_EXCLUDE]
        }).catch(function(error) {
            const errorCode = error.code
            const errorMessage = error.message
            if (errorCode === 'auth/invalid-email') {
                alert(errorMessage)
            } else if (errorCode === 'auth/user-not-found') {
                alert(errorMessage)
            }
            console.log(error)
        })
    }
    /**
    * initLogin handles setting up UI event listeners and registering Firebase auth listeners:
    *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
    *    out, and that is where we update the UI.
    */

    checkAuthState = (user) => {
        this.setVerifyEmailDisableState(true)
        // [END_EXCLUDE]
        if (user) {
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
        } else {
            // User is signed out.
            this.setSignInStatus('Signed out')
            this.setSignInButtonText('Sign in')
            this.setAccountDetails('null')
        }
        this.setSignInButtonDisableState(false)
    }
    initLogin = () => {
        firebase.auth().onAuthStateChanged(this.checkAuthState)
        if (firebase.auth().currentUser) {
            this.checkAuthState()
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
        return (
            <div className="Login">
                <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
                    <header className="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700">
                        <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
                            <div className="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--8-col-desktop">
                                <a href="/"><h3>Home</h3></a>
                            </div>
                        </div>
                    </header>

                    <main className="mdl-layout__content mdl-color--grey-100">
                        <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
                            <div className="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
                                <div className="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">
                                    <h2 className="mdl-card__title-text">Sefi and Or's Email &amp Password Authentication</h2>
                                </div>
                                <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                                    <p>Enter an email and password below and either sign in to an existing account or sign up</p>

                                    <input className="mdl-textfield__input"
                                        style={{display: 'inline', width: 'auto'}}
                                        type="text"
                                        onChange={this.emailChange}
                                        id="email"
                                        name="email"
                                        placeholder="Email"
                                    />
                                    &nbsp;&nbsp;&nbsp;
                                    <input
                                        className="mdl-textfield__input"
                                        style={{display: 'inline', width: 'auto'}}
                                        type="password"
                                        onChange={this.passChange}
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                    />
                                    <br/><br/>
                                    <button
                                        disabled={this.state.signIn.disabled}
                                        className="mdl-button mdl-js-button mdl-button--raised"
                                        onClick={this.toggleSignIn}
                                        id="sign-in"
                                        name="signin"
                                    >
                                        {this.state.signIn.value}
                                    </button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button
                                        className="mdl-button mdl-js-button mdl-button--raised"
                                        onClick={this.handleSignUp}
                                        id="sign-up"
                                        name="signup"
                                    >
                                        Sign Up
                                    </button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button
                                        className="mdl-button mdl-js-button mdl-button--raised"
                                        onClick={this.sendEmailVerification}
                                        disabled={this.state.verifyEmail.disabled}
                                        id="verify-email"
                                        name="verify-email"
                                    >
                                        Send Email Verification
                                    </button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button
                                        className="mdl-button mdl-js-button mdl-button--raised"
                                        onClick={this.sendPasswordReset}
                                        id="password-reset"
                                        name="verify-email"
                                    >
                                        Send Password Reset Email
                                    </button>


                                    <div className="user-details-container">
                                        Firebase sign-in status: <span id="sign-in-status">{this.state.signInStatus.value}</span>
                                        <div>Firebase auth <code>currentUser</code> object value:</div>
                                        <pre><code id="account-details">{this.state.accountDetails.value}</code></pre>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        )
    }
}

export default Login
