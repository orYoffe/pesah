import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '../helpers/auth'
import { pageView } from '../helpers/analytics'

class PassReset extends Component {
    state = {
        email: {
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

    resetPassword = (e) => {
        e && e.preventDefault()
        e && e.stopPropagation()

            const email = this.state.email.value
            if (email.length < 4) {
                this.setMessage('error', 'Please enter an email address.')
                return false
            }
            resetPassword(email)
           .then(user => this.setMessage('message', 'An email has been sent to you.'))
            .catch((error) => {
              // TODO fix error handing for error.code: "auth/user-not-found"
                this.setMessage('error', error.message)
                console.log(error)
            })
        return false
    }

    componentDidMount() {
        pageView('passreset');
    }

    render() {
        const { messages: { message, error } } = this.state

        return (
            <div className="PassReset container">
                <h2>Password reset</h2>
                <p>Please fill in your email and we will send you an email to reset your password</p>
                <form onSubmit={this.resetPassword}>
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
                    <input
                        className="btn btn-primary form-control"
                        onClick={this.resetPassword}
                        id="sign-in"
                        type="submit"
                        value="Reset Password"
                    />
                </form>
                {!!error && <br/>}
                {!!error && <div style={{color: '#f00'}}>{error}</div>}
                {!!message && <br/>}
                {!!message && <div>{message}</div>}


                <br />
                <br />
                <p>Don't have a User? Sign up <Link to="signup">here</Link></p>
            </div>
        )
    }
}

export default PassReset
