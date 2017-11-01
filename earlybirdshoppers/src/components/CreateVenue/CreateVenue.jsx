import React, { Component } from 'react'
import store from 'store'
import { connect } from 'react-redux'
// import '../UserItem.css'
// import './CreateVenue.css'
import { readFile, getLocation, getLocationImage } from '../../helpers/common'
// import { createVenue } from '../../helpers/db/venue'
import GSearchInput from '../GSearchInput/'
import Input from '../Input'
import Map from '../Map'

const LOCALSTORAGE_CREATE_VENUE_KEY = 'create_venue_values'

class CreateVenue extends Component {
    state = {
        image: null,
        error: '',
        errors: [],
        values: null,
        paidEntrance: null,
        venueSize: 'S',
        hasLocalAudience: null,
        hasGuarantee: null,
        location: null,
        isLazarya: true,
    }

    componentDidMount() {
        // TODO keep values in local storage better
        // const storedValues = store.get(LOCALSTORAGE_CREATE_VENUE_KEY)
        // if (storedValues) {
        //     this.setState({values: storedValues})
        // }
    }
    // componentWillUpdate(nextProps, nextState) {
    //     // TODO keep values in local storage better
    //     const storedValues = store.get(LOCALSTORAGE_CREATE_VENUE_KEY)
    //     if (storedValues) {
    //         this.setState({values: storedValues})
    //     }
    // }

    // isValid = ({
    //     title, date, location, venue, artist, price, accountType, goal, time
    // }) => {
    //     const errors = []
    //     let error = ''
        
    //     if (title.length < 5) {
    //         errors.push('title')
    //         error = `

    //         Title must be longer than 4 chars
    //         `
    //     }
        
    //     if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
    //         errors.push('date')
    //         error = `${error}

    //         Date is required
    //         `
    //     } else {
    //         const now = new Date()
    //         if (new Date(date).getTime() <= now.getTime()) {
    //             errors.push('date')
    //             error = `${error}

    //             Date must be in the future
    //             `
    //         }
    //     }
    //     if (!moment(time, 'HH:mm', true).isValid()) {
    //         errors.push('time')
    //         error = `${error}

    //         Time is required
    //         `
    //     }
    //     if (
    //         !location ||
    //         !location.address_components ||
    //         !location.address_components
    //         .find(prop => prop.types.indexOf('country') !== -1) ||
    //         !location.address_components
    //             .find(prop => prop.types.indexOf('locality') !== -1)
    //         ) {
    //         errors.push('location')
    //         error = `${error}

    //         Location is required
    //         `
    //     }
    //     if (accountType === 'artist' && venue.length < 5) {
    //         errors.push('venue')
    //         error = `${error}
    //         Venue must be longer than 4 chars
    //         `
    //     }
    //     if (accountType === 'venue' && artist.length < 5) {
    //         errors.push('artist')
    //         error = `${error}
    //         Artists must be longer than 4 chars
    //         `
    //     }
    //     // TODO fix validation for price and goal
    //     if (isNaN(parseInt(price, 10)) || parseInt(price, 10) < 0) {
    //         errors.push('price')
    //         error = `${error}
    //         Price is required
    //         `
    //     }
    //     if (isNaN(parseInt(goal, 10)) || parseInt(goal, 10) < 0 || parseInt(goal, 10) <= parseInt(price, 10)) {
    //         errors.push('goal')
    //         error = `${error}
    //         Bar goal is required and must be higher than ticket price
    //         `
    //     }

    //     if (errors.length) {
    //         this.setState({ error, errors })
    //         return false
    //     }

    //     return true
    // }
    
    onSubmit = e => {
        e && e.preventDefault()
        // const { trans, accountType } = this.props
        // const { image } = this.state
        // let venue
        // let artist

        // const places = this.venueLocation.getPlaces() || []
        
        // const title = this.venueName.value.trim()
        // const date = this.venueDate.value
        // const time = this.time.value
        // const price = this.ticketPrice.value
        // const goal = this.goal.value
        // const currency = trans.currency
        // const location = places[0]
        // if (accountType === 'artist') {
        //     venue = this.venue.value.trim() 
        // } else {
        //     artist = this.artist.value.trim() 
        // }
        // // TODO connect to real venues
        // // TODO if venue is not in platform add details and add venue
        // const photoURL = image
        
        // if (this.isValid({
        //     title, date, time, location, venue, artist, price, goal, accountType
        // })) {
            // const error = createVenue({
            //     title, date: new Date(date).toJSON(), time, price, goal,
            //     currency, location, venue, artist, photoURL, accountType,
            // })
            // if (error && error.then) {
            //     error.then(venue => {
            //         // debugger
            //         console.log(' new venue ===', venue)
            //         // this.props.history.push(`/venue/${venue.uid}`)
            //     }).catch(err => {
            //         // TODO handle errors
            //         console.log('error ===', err)
            //     })
            // } else {
            //     switch (error) {
            //         case 'login':
            //             return this.setState({ error: 'Please Login to Create Venue', errors: [] })
            //         case 'verifyemail':
            //             return this.setState({
            //                 error: 'Please verify your email in order to Create Venue you need to verify your email',
            //                 errors: []
            //             })
            //         default:
            //         this.setState({error: '', errors: []})
            //             break
            //     }
            // }
        // }
    }

    onFileChange = e => {
        readFile(e.target.files, venue => {
            this.setState({image: venue.target.result})
        })
    }

    renderHowMany = numberOfTickets => numberOfTickets && <p>Number of tickets required to reach Bar goal is {numberOfTickets} tickets</p>
    onPricingChange = () => {
    }

    onInputChange = () => {
        // const { accountType } = this.props
        // // const { image } = this.state
        // let venue
        // let artist

        // const places = this.venueName.value.trim()
        // const date = this.eventDate.value
        // const time = this.time.value
        // const price = this.ticketPrice.value
        // const goal = this.goal.value
        // const location = places[0]
        // if (accountType === 'artist') {
        //     venue = this.venue.value.trim() 
        // } else {
        //     artist = this.artist.value.trim() 
        // }
        // // const photoURL = image

        // store.set(LOCALSTORAGE_CREATE_VENUE_KEY, {
        //     title, date: date, time, price, goal,
        //     location, venue, artist,
        // })
        // this.onPricingChange()
    }

    setLocationImage = e => {
        e && e.preventDefault()
        const place = this.venueLocation.getPlaces()[0]
        const image = getLocationImage(place, {
            maxHeight: 200,
            maxWidth: 200,
        })
        if (image) {
            this.setState({ image })
        }
    }
    checkSize = e => this.setState({venueSize: e.target.value})
    onPlacesChanged = () => {
        const place = this.venueLocation.getPlaces()[0]
        const location = getLocation(place)
        console.log('place======', place)
        console.log('location object======', location)
        if (place && location) {
            this.setState({
                location
            })
        } else if (this.state.location) {
            this.setState({ location: null })
        }
    }
    getError = (key) => this.state.errors.indexOf(key) !== -1 ? 'has-warning' : ''
    render() {
        const {
            image,
            error,
            values,
            paidEntrance,
            venueSize,
            hasLocalAudience,
            hasGuarantee,
            location,
            isLazarya,
        } = this.state
        console.log('values=========', values)
        if (values) {
            store.set(LOCALSTORAGE_CREATE_VENUE_KEY, values)
        }
        return (
            <div className="container">
                <h3>Create Venue</h3>
                <form onSubmit={this.onSubmit}>
                    {error && <div className="error" >{error}</div>}
                    <div className="form-group">
                        <label className="form-control checkbox">
                            <input
                                type="checkbox"
                                checked={isLazarya}
                                onChange={this.onLazaryaChange}
                            />
                            Is from Lazarya?
                        </label>
                    </div>
                    <Input
                        refFunc={node => this.venueName = node}
                        isRequired
                        className={this.getError('name')}
                        id="venueName"
                        label="Name"
                        type="text"
                        onInputChange={this.onInputChange}
                        placeholder="Venue Name"
                        />
                    <Input
                        refFunc={node => this.contactPerson = node}
                        isRequired
                        className={this.getError('contactPerson')}
                        id="contactPerson"
                        label="Contact Person"
                        type="text"
                        onInputChange={this.onInputChange}
                        placeholder="Venue Contact Person"
                        />
                    <Input
                        refFunc={node => this.venueEmail = node}
                        isRequired
                        className={this.getError('venueEmail')}
                        id="email"
                        label="Email"
                        type="email"
                        onInputChange={this.onInputChange}
                        placeholder="example@example.com"
                        />
                    <Input
                        refFunc={node => this.phoneNumber = node}
                        isRequired
                        className={this.getError('phone')}
                        id="phoneNumber"
                        label="Phone number"
                        type="tel"
                        onInputChange={this.onInputChange}
                        placeholder="XXX-XXXXXXX"
                        />
                    <Input
                        refFunc={node => this.website = node}
                        isRequired
                        className={this.getError('db')}
                        id="website"
                        label="Website"
                        type="url"
                        onInputChange={this.onInputChange}
                        placeholder="www.something.co..."
                        />
                    <Input
                        refFunc={node => this.fb = node}
                        isRequired
                        className={this.getError('fb')}
                        id="fb"
                        label="Facebook"
                        type="url"
                        onInputChange={this.onInputChange}
                        placeholder="www.facebook.com/username..."
                    />
                    <Input
                        refFunc={node => this.venueType = node}
                        isRequired
                        className={this.getError('venueType')}
                        id="venueType"
                        label="Type of venue"
                        type="text"
                        onInputChange={this.onInputChange}
                        placeholder="Type of venue"
                    />
                    <Input
                        refFunc={node => this.genre = node}
                        isRequired
                        className={this.getError('genre')}
                        id="venueGenre"
                        label="Genre"
                        type="text"
                        onInputChange={this.onInputChange}
                        placeholder="Genre"
                    />
                    <Input
                        refFunc={node => this.capacity = node}
                        isRequired
                        className={this.getError('capacity')}
                        id="venueCapacity"
                        label="Capacity"
                        type="number"
                        onInputChange={this.onInputChange}
                        placeholder="200"
                    />
                    <Input
                        refFunc={node => this.date = node}
                        isRequired
                        className={this.getError('date')}
                        id="venueLastEdit"
                        label="Last edited"
                        type="date"
                        onInputChange={this.onInputChange}
                        placeholder="Last edited"
                    />
                    <p>Venue size</p>
                    <div className="radio">
                        <label>
                            <input type="radio"
                                checked={venueSize === 'S'}
                                onChange={this.checkSize} name="optionsVenueSizeRadios" id="optionsVenueSizeRadios0" value="S" />
                            S
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio"
                                checked={venueSize === 'M'}
                                onChange={this.checkSize} name="optionsVenueSizeRadios" id="optionsVenueSizeRadios1" value="M" />
                            M
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio"
                                checked={venueSize === 'L'}
                                onChange={this.checkSize} name="optionsVenueSizeRadios" id="optionsVenueSizeRadios2" value="L" />
                            L
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio"
                                checked={venueSize === 'XL'}
                                onChange={this.checkSize} name="optionsVenueSizeRadios" id="optionsVenueSizeRadios3" value="XL" />
                            XL
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="form-control checkbox">
                            <input
                                type="checkbox"
                                checked={hasLocalAudience}
                                onChange={this.onLocalAudienceChange}
                            />
                            Has local Audience?
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="form-control checkbox">
                            <input
                                type="checkbox"
                                checked={paidEntrance}
                                onChange={this.onPaidEntranceChange}
                            />
                            paid entrance?
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="form-control checkbox">
                            <input
                                type="checkbox"
                                checked={hasGuarantee}
                                onChange={this.onGuaranteeChange}
                            />
                            Has Guarantee?
                        </label>
                    </div>
                    <Input
                        refFunc={node => this.businessPlan = node}
                        isRequired
                        className={this.getError('businessPlan')}
                        id="businessPlan"
                        label="Business Plan"
                        type="text"
                        onInputChange={this.onInputChange}
                        placeholder="Business Plan"
                    />
                    <Input
                        refFunc={node => this.description = node}
                        isRequired
                        className={this.getError('description')}
                        id="description"
                        label="Description"
                        type="text"
                        onInputChange={this.onInputChange}
                        placeholder="Description..."
                    />
                    <Input
                        refFunc={node => this.comments = node}
                        isRequired
                        className={this.getError('comments')}
                        id="comments"
                        label="Comments"
                        type="text"
                        onInputChange={this.onInputChange}
                        placeholder="Comments..."
                    />
                    <div className={`form-group ${this.getError('location')} `}>
                        <label htmlFor="venueLocation">Venue Location</label>
                        <GSearchInput 
                            placeholder="Somewhere street 54..."
                            className="form-control"
                            id="venueLocation"
                            refrence={node => this.venueLocation = node}
                            onPlacesChanged={this.onPlacesChanged}
                        />
                    </div>
                    {location && (
                        <div>
                            <p>
                                city: {location.city}
                                <br/>
                                country: {location.country}
                                <br/>
                                countryShortName: {location.countryShortName}
                                <br/>
                                district: {location.district}
                                <br/>
                                address: {location.address}
                                <br/>
                                intphone: {location.intphone}
                                <br/>
                                phone: {location.phone}
                                <br/>
                                name: {location.name}
                                <br/>
                                lat: {location.lat}
                                <br/>
                                lng: {location.lng}
                                <br/>
                                website: {location.website}
                                <br/>
                                icon: <img src={location.icon} alt=""/>
                                <br/>
                                {location.photo && <span>
                                    photo: <img src={location.photo} alt="" /> <button onClick={this.setLocationImage}>Set as profile picture</button>
                                    </span>}
                            </p>
                            <Map markers={[
                                {
                                    position: { lng: location.lng, lat: location.lat }
                                },
                            ]}/>
                        </div>
                    )}
                    <div className={`form-group ${this.getError('venuePhoto')} `}>
                        <label htmlFor="venuePhoto">Upload venue profile picture</label>
                        <input
                            className="form-control"
                            type="file"
                            onChange={this.onFileChange}
                            id="venuePhoto" />
                    </div>
                    <br />
                    {image && [
                        <h5 key="venue-cover-image-display-header">Venue Profile picture</h5>,
                        <img src={image} alt="venue cover" title="venue cover" key="venue-cover-image-display-picture" />
                    ]}
                    <input
                        className="btn btn-primary form-control"
                        onClick={this.onSubmit}
                        type="submit"
                        value="Create Venue"
                    />
                </form>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    trans: state.locale.trans,
})

export default connect(mapStateToProps)(CreateVenue)