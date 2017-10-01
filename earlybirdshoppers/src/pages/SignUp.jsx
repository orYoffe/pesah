import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signup } from '../helpers/auth'
import { Link } from 'react-router-dom'
import { login as loginAction } from '../reducers/auth'

class Signup extends Component {
    state = {
        loggedIn: false,
        email: {
            value: '',
        },
        pass: {
            value: '',
        },
        name: {
            value: '',
        },
        messages: {
            error: '',
            message: ''
        },
        type: 'artist',
    }

    checkType = e => {
        this.setState({type: e.target.value})
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

    nameChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.name.value !== value) {
            this.setState({ name: { value }})
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

    isValid = () => {
        const email = this.state.email.value
        const password = this.state.pass.value
        const displayName = this.state.name.value
        if (displayName.length < 4) {
            this.setMessage('error', 'Please enter a Name or a Title.')
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
        return true
    }

    handleSignUp = (e) => {
        e && e.preventDefault()
        e && e.stopPropagation()
        if(!this.isValid()) {
            return false
        }
        const email = this.state.email.value
        const password = this.state.pass.value
        const displayName = this.state.name.value
        signup({
            email,
            password,
            isArtist: this.state.type === 'artist',
            displayName,
        })
        .then(user => this.props.login(user))
        .catch((error) => {
            const errorMessage = error.message
            this.setMessage('error', errorMessage)
            console.log(error)
        })
        return false
    }

    render() {
        const { messages: { message, error }, type } = this.state
        const isArtist = type === 'artist'

        return (
            <div className="Signup container">
                <h2>Sign up</h2>
                <form onSubmit={this.handleSignUp}>
                    <div className="radio">
                        <label>
                            <input type="radio"
                            checked={isArtist}
                            onChange={this.checkType} name="optionsRadios" id="optionsRadios1" value="artist" />
                            I am an Artist
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio"
                            checked={!isArtist}
                            onChange={this.checkType} name="optionsRadios" id="optionsRadios2" value="venue" />
                            I own a Venue
                        </label>
                    </div>
                    <label htmlFor="name">Name/Title:</label>
                    <input
                        className="form-control"
                        type="text"
                        onChange={this.nameChange}
                        id="name"
                        name="displayName"
                        placeholder="Lizards of Gondor"
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
                <p>Already have a User? Log in <Link to="login">here</Link></p>
            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return { login: (user) => dispatch(loginAction(user)) }
}

export default connect(() => ({}), mapDispatchToProps)(Signup)
