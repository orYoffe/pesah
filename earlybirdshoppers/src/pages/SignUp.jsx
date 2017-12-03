import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signup } from '../helpers/auth'
import { capitalize } from '../helpers/common'
import { Link, Redirect } from 'react-router-dom'
import { login as loginAction } from '../reducers/auth'
import { pageView } from '../helpers/analytics'

class Signup extends Component {
    state = {
        loggedIn: false,
        phone: {
            value: '',
        },
        email: {
            value: '',
        },
        pass: {
            value: '',
        },
        passConfirm: {
            value: '',
        },
        name: {
            value: '',
        },
        firstname: {
            value: '',
        },
        lastname: {
            value: '',
        },
        messages: {
            error: '',
            message: ''
        },
        type: 'musician',
    }

    checkType = e => this.setState({type: e.target.value})

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

    nameChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.name.value !== value) {
            this.setState({ name: { value }})
        }
    }
    firstnameChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.firstname.value !== value) {
            this.setState({ firstname: { value }})
        }
    }
    lastnameChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.lastname.value !== value) {
            this.setState({ lastname: { value }})
        }
    }

    emailChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.email.value !== value) {
            this.setState({ email: { value }})
        }
    }

    phoneChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.phone.value !== value) {
            this.setState({ phone: { value }})
        }
    }

    passChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.pass.value !== value) {
            this.setState({ pass: { value }})
        }
    }

    passConfirmChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.passConfirm.value !== value) {
            this.setState({ passConfirm: { value }})
        }
    }

    isValid = () => {
        const email = this.state.email.value
        const password = this.state.passConfirm.value
        const passwordConfirm = this.state.passConfirm.value
        const displayName = this.state.name.value
        const firstname = this.state.firstname.value
        const lastname = this.state.lastname.value
        if (displayName.length < 2) {
            this.setMessage('error', 'Please enter a Name or a Title.')
            return false
        }
        if (firstname.length < 2) {
            this.setMessage('error', 'Please enter a First Name or a Title.')
            return false
        }
        if (lastname.length < 2) {
            this.setMessage('error', 'Please enter a Last Name or a Title.')
            return false
        }
        if (email.length < 4) {
            this.setMessage('error', 'Please enter an email address.')
            return false
        }
        if (password.length < 4) {
            this.setMessage('error', 'Please enter a password.')
            return false
        }
        if (passwordConfirm.length < 4) {
            this.setMessage('error', 'Please enter a the password again for confirmation.')
            return false
        }
        if (passwordConfirm !== password) {
            this.setMessage('error', 'The password and the password confirmation must be the same.')
            return false
        }
        return true
    }

    handleSignUp = (e) => {
        e && e.preventDefault()
        e && e.stopPropagation()
        const { type } = this.state
        if(!this.isValid() || type === 'venue') { // TODO fix signup process for venue = > venueManager
            return false
        }
        const accountType = type === 'venue' ? 'venueManager' : type
        const { login } = this.props
        const email = this.state.email.value
        const password = this.state.pass.value
        const displayName = this.state.name.value
        const firstname = this.state.firstname.value
        const lastname = this.state.lastname.value
        signup({
            email,
            password,
            displayName,
            firstname,
            lastname,
            accountType,
        })
        .then(res => {
            const user = res.user
            return login({
                email,
                firstname,
                lastname,
                displayName,
                accountType,
                uid: user.uid,
            })
        })
        .catch((error) => {
            const errorMessage = error.message
            this.setMessage('error', errorMessage)
            console.log(error)
        })
        return false
    }

    componentDidMount() {
        pageView('signup');
    }

    render() {
        const { history } = this.props
        const { messages: { message, error }, type } = this.state

        if (this.props.isLoggedIn) {
            if (history && history.length) {
                history.goBack()
                return null
            } else {
                return  <Redirect to="/" />
            }
        }
        const capitalizedType = capitalize(type)
        const isMusician = type === 'musician'

        return (
            <div className="Signup container">
                <h2>Sign up as a {capitalizedType}</h2>
                <form onSubmit={this.handleSignUp}>
                    <div className="radio">
                        <label>
                            <input type="radio"
                            checked={type === 'musician'}
                            onChange={this.checkType} name="optionsRadios" id="optionsRadios0" value="musician" />
                        Musician
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio"
                            checked={type === 'venue'}
                            onChange={this.checkType} name="optionsRadios" id="optionsRadios2" value="venue" />
                            Venue
                        </label>
                    </div>
                    <label htmlFor="name">{capitalizedType} Name:</label>
                    <input
                        className="form-control"
                        type="text"
                        onChange={this.nameChange}
                        id="name"
                        name="displayName"
                        placeholder={isMusician ? 'Lizards of Gondor' : 'The Great Piano club'}
                        required
                    />
                    <br />
                    <label htmlFor="firstname">First Name:</label>
                    <input
                        className="form-control"
                        type="text"
                        onChange={this.firstnameChange}
                        id="firstname"
                        name="firstname"
                        placeholder="John"
                        required
                    />
                    <br />
                    <label htmlFor="lastname">Last Name:</label>
                    <input
                        className="form-control"
                        type="text"
                        onChange={this.lastnameChange}
                        id="lastname"
                        name="lastname"
                        placeholder="Doe"
                        required
                    />
                    <br />
                    <label htmlFor="email">Email:</label>
                    <input
                        className="form-control"
                        type="email"
                        onChange={this.emailChange}
                        id="email"
                        name="email"
                        placeholder="example@example.com"
                        required
                    />
                    {!isMusician && <br />}
                    {!isMusician && <label htmlFor="phone">Phone number:</label>}
                    {!isMusician && (
                        <input
                            className="form-control"
                            type="tel"
                            onChange={this.phoneChange}
                            id="phone"
                            name="phone"
                            placeholder="XXX-XXXXXXX"
                            required
                        />
                    )}
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input
                        className="form-control"
                        type="password"
                        onChange={this.passChange}
                        id="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                    <br />
                    <label htmlFor="passwordConfirm">Password Confirmation:</label>
                    <input
                        className="form-control"
                        type="password"
                        onChange={this.passConfirmChange}
                        id="passwordConfirm"
                        name="passwordConfirm"
                        placeholder="Password Confirmation"
                        required
                    />
                    {!isMusician && <br />}
                    {!isMusician && <label htmlFor="location">Location:</label>}
                    {!isMusician && (
                        <input
                            className="form-control"
                            type="text"
                            onChange={this.locationChange}
                            id="location"
                            name="location"
                            placeholder="XXX-XXXXXXX"
                            required
                            />
                    )}
                    {!isMusician && <br />}
                    {!isMusician && <label htmlFor="url">URL:</label>}
                    {!isMusician && (
                        <input
                            className="form-control"
                            type="text"
                            onChange={this.urlChange}
                            id="url"
                            name="url"
                            placeholder="XXX-XXXXXXX"
                            required
                            />
                    )}
                    {!isMusician && <br />}
                    {!isMusician && <label htmlFor="capacity">Capacity:</label>}
                    {!isMusician && (
                        <input
                            className="form-control"
                            type="text"
                            onChange={this.urlChange}
                            id="capacity"
                            name="capacity"
                            placeholder="XXX-XXXXXXX"
                            required
                            />
                    )}
                    <br />
                    <input
                        className="btn btn-primary form-control"
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

                {isMusician && <br />}
                {isMusician && <input
                    className="btn btn-primary"
                    type="button"
                    value="Connect with FB (unfunctional)"
                />}
                {isMusician && <br />}
                {isMusician && <input
                    className="btn btn-primary"
                    type="button"
                    value="Connect with google (unfunctional)"
                />}
                {isMusician && <br />}
                {isMusician && <input
                    className="btn btn-primary"
                    type="button"
                    value="Connect with twitter (unfunctional)"
                />}

                {isMusician && <br />}
                <br />
                <p>Already have a User? Log in <Link to="login">here</Link></p>
                <br />
                <br />
            </div>

        )
    }
}

const mapDispatchToProps = dispatch => ({ login: (user) => dispatch(loginAction(user)) })

const mapStateToProps = state => ({isLoggedIn: state.auth.loggedIn})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
