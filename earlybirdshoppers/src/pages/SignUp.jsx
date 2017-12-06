import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signup } from '../helpers/auth'
import { checkVenueUrl } from '../helpers/firebase'
import { getLocation, capitalize, isEmailValid } from '../helpers/common'
import { Link, Redirect } from 'react-router-dom'
import { login as loginAction } from '../reducers/auth'
import { pageView } from '../helpers/analytics'
import GSearchInput from '../components/GSearchInput/'
import Map from '../components/Map'

class Signup extends Component {
    state = {
        loggedIn: false,
        phone: {
            value: 0,
        },
        seatingCapacity: {
            value: 0,
        },
        standingCapacity: {
            value: 0,
        },
        profileUrl: {
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
        location: false,
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

    profileUrlChange = (e) => {
        const value = e.target.value
        const url = value && value.trim().replace(/ /g, '_').replace(/[^\w\s]/gi, '');
        if (!!url && this.state.profileUrl.value !== url) {
            checkVenueUrl(value, (isUrlFree) => {
                if (isUrlFree) {
                    this.setState({ profileUrl: { value: url }})
                } else {
                    this.setMessage('error', 'This profile url is taken, please choose another.')
                }
            })
        }
    }

    seatingCapacityChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.seatingCapacity.value !== value) {
            this.setState({ seatingCapacity: { value }})
        }
    }

    standingCapacityChange = (e) => {
        const value = e.target.value
        if (!!value && this.state.standingCapacity.value !== value) {
            this.setState({ standingCapacity: { value }})
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
    onPlacesChanged = () => {
        const place = this.venueLocation.getPlaces()[0]
        const location = getLocation(place)
        if (place && location) {
            this.setState({ location })
        } else if (this.state.location) {
            this.setState({ location: null })
        }
    }

    isValid = () => {
        const {
            email,
            passConfirm,
            pass,
            name,
            firstname,
            lastname,
            type,
        } = this.state
        const password = pass.value
        const passwordConfirm = passConfirm.value
        const displayName = name.value
        if (displayName.length < 2) {
            this.setMessage('error', 'Please enter a Name or a Title.')
            return false
        }
        if (firstname.value.length < 2) {
            this.setMessage('error', 'Please enter a First Name or a Title.')
            return false
        }
        if (lastname.value.length < 2) {
            this.setMessage('error', 'Please enter a Last Name or a Title.')
            return false
        }
        if (email.value.length < 4 || !isEmailValid(email.value)) {
            this.setMessage('error', 'Please enter a valid email address.')
            return false
        }
        if (password.length < 6) {
            this.setMessage('error', 'Please enter a password.')
            return false
        }
        if (passwordConfirm.length < 6) {
            this.setMessage('error', 'Please enter the password again for confirmation.')
            return false
        }
        if (passwordConfirm !== password) {
            this.setMessage('error', 'The password and the password confirmation must be the same.')
            return false
        }
        if (type === 'venue') {
            const {
                location,
                // seatingCapacity,
                // standingCapacity,
                profileUrl,
            } = this.state
            const url = profileUrl.value.trim().replace(/ /g, '_').replace(/[^\w\s]/gi, '');
            if (url.length < 1) {
                this.setMessage('error', 'Please enter a proper Profile url.')
                return false
            }
            if (
            !location ||
            !location.city ||
            !location.country ||
            !location.countryShortName ||
            !location.address ||
            !location.lat ||
            !location.lng
            ) {
                this.setMessage('error', 'Please enter a valid location')
                return false
            }
        }
        return true
    }

    handleSignUp = (e) => {
        e && e.preventDefault()
        e && e.stopPropagation()
        const { type } = this.state
        if(!this.isValid()) {
            return false
        }
        const accountType = type === 'venue' ? 'venueManager' : 'musician'
        const { login } = this.props
        const email = this.state.email.value
        const password = this.state.pass.value
        const displayName = this.state.name.value
        const firstname = this.state.firstname.value
        const lastname = this.state.lastname.value

        let signupRequest
        if (accountType === 'venueManager') {
            const {
                location,
                seatingCapacity,
                standingCapacity,
                profileUrl,
            } = this.state
            signupRequest = signup({
                email,
                password,
                displayName,
                firstname,
                lastname,
                accountType,
                location,
                seatingCapacity: seatingCapacity.value,
                standingCapacity: standingCapacity.value,
                profileUrl: profileUrl.value,
            })
        } else {
            signupRequest = signup({
                email,
                password,
                displayName,
                firstname,
                lastname,
                accountType,
            })
        }
        signupRequest.then(res => {
            if (!res || res.code !== 200 || res.message !== 'ok') {
                return this.setMessage('error', 'An error accurd and we couldn\'t register you')
            }
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
        const { messages: { message, error }, type, location, profileUrl, name } = this.state

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
                            type="number"
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
                    {!isMusician && <label htmlFor="profileUrl">Profile Url:</label>}
                    {!isMusician && (
                        <input
                            className="form-control"
                            type="text"
                            onChange={this.profileUrlChange}
                            id="profileUrl"
                            name="profileUrl"
                            placeholder={name.value ? name.value.replace(/ /g, '_').replace(/[^\w\s]/gi, '') : 'The_Great_Piano_club'}
                            required
                            />
                    )}
                    {!isMusician && <br />}
                    {!isMusician && profileUrl.value && <p>
                        Your full url will be: www.raisethebar/v/{profileUrl.value.replace(/ /g, '_').replace(/[^\w\s]/gi, '')}
                    </p>}
                    {!isMusician && <br />}
                    {!isMusician && <label htmlFor="standingCapacity">Standing capacity:</label>}
                    {!isMusician && (
                        <input
                            className="form-control"
                            type="number"
                            onChange={this.standingCapacityChange}
                            id="standingCapacity"
                            name="standingCapacity"
                            placeholder="50"
                            required
                            />
                    )}
                    {!isMusician && <br />}
                    {!isMusician && <label htmlFor="seatingCapacity">Seating capacity:</label>}
                    {!isMusician && (
                        <input
                            className="form-control"
                            type="number"
                            onChange={this.seatingCapacityChange}
                            id="seatingCapacity"
                            name="seatingCapacity"
                            placeholder="20"
                            required
                            />
                    )}
                    {!isMusician && <br />}
                    {!isMusician && (
                        <div className="form-group col-md-12">
                            <label htmlFor="venueLocation">Venue Location</label>
                            <GSearchInput
                                placeholder="Somewhere street 54..."
                                className="form-control"
                                id="venueLocation"
                                refrence={node => this.venueLocation = node}
                                onPlacesChanged={this.onPlacesChanged}
                            />
                        </div>
                    )}
                    {!isMusician && location && (
                        <div className="col-md-12">
                            <Map markers={[
                                {
                                    position: { lng: location.lng, lat: location.lat }
                                },
                            ]} />
                        </div>
                    )}
                    <br />
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
