import React, { Component } from 'react'
import store from 'store'
import { connect } from 'react-redux'
import { readFile, getLocation, getLocationImage, scrollToTop, capitalize } from '../../helpers/common'
import { createNonUserVenue, getVenue, editNonUserVenue } from '../../helpers/firebase'
import GSearchInput from '../GSearchInput/'
import Input from '../Input'
import Checkbox from '../Checkbox'
import RadioButtons from '../RadioButtons'
import Map from '../Map'
import Modal from '../Modal/'

const LOCALSTORAGE_CREATE_VENUE_KEY = 'create_venue_admin_values'

const defaultValues = {
    isModalOpen: false,
    image: null,
    error: '',
    errors: [],
    paidEntrance: false,
    venueSize: '',
    hasLocalAudience: false,
    hasGuarantee: false,
    location: null,
    isLazarya: true,
    contactPerson: '',
    venueEmail: '',
    phoneNumber: '',
    website: '',
    fb: '',
    venueType: '',
    genre: '',
    capacity: '',
    date: '',
    businessPlan: '',
    description: '',
    comments: '',
    name: '',
}

class CreateVenue extends Component {
    state = defaultValues

    componentDidMount() {
        const { match: { params: { venueUid } } } = this.props
        if (venueUid) {
            getVenue(venueUid, snapshot => {
                const venue = snapshot.val()
                if (venue) {
                    const {
                        locationLng, locationLat, locationAddress, locationCity, locationCountry, locationCountryShortName,
                    } = venue
                    const location = {
                        lng: locationLng, lat: locationLat,
                        address: locationAddress,
                        city: locationCity, country: locationCountry, countryShortName: locationCountryShortName,
                    }
                    venue.location = location
                    this.setState(venue)
                } else {
                    this.setState({ error: 'not found' })
                }
            })
            .catch(snapshot => {
                this.setState({ error: 'not found' })
            })
        } else {
            const storedValues = store.get(LOCALSTORAGE_CREATE_VENUE_KEY)
            if (storedValues) {
                storedValues.error = ''
                storedValues.errors = []
                storedValues.isModalOpen = false
                this.setState(storedValues)
            }
        }
    }
    componentWillUpdate(nextProps, nextState) {
        store.set(LOCALSTORAGE_CREATE_VENUE_KEY, nextState)
    }

    clearValues = () => this.setState(defaultValues)
    onModalClose = () => this.setState({ isModalOpen: false })

    isValid = ({ name, location }) => {
        const errors = []
        let error = ''
        
        if (name.length < 4) {
            errors.push('name')
            error = `

            Name must be longer than 3 chars
            `
        }
        
        if (
            !location ||
            !location.city ||
            !location.country ||
            !location.countryShortName ||
            !location.district ||
            !location.address ||
            !location.lat ||
            !location.lng
        ) {
            errors.push('location')
            error = `${error}

            Location is required
            `
        }

        if (errors.length) {
            this.setState({ error, errors })
            scrollToTop()
            return false
        }

        return true
    }
    
    onSubmit = e => {
        e && e.preventDefault()
        const { location, name } = this.state
        
        if (this.isValid({ name, location })) {
            this.setState({isModalOpen: true})
        }
    }
    onConfirm = () => {
        const {
            image, paidEntrance, venueSize, hasLocalAudience, hasGuarantee, isLazarya, contactPerson,
            venueEmail, phoneNumber, website, fb, venueType, genre, capacity, date,
            businessPlan, description, comments, name, location,
        } = this.state
        const { match: { params: { venueUid } } } = this.props
        let error

        const locationProps = {}
        Object.keys(location).forEach(itemKey => locationProps[`location${capitalize(itemKey)}`] = location[itemKey])
    
        console.log('submit============ ', {
            contactPerson, venueEmail, phoneNumber, website, fb, venueType, genre,
            capacity, date: new Date(date).toJSON(), businessPlan, description, comments, isLazarya,
            paidEntrance, name, venueSize, hasLocalAudience, hasGuarantee, image, ...locationProps,
        })
        if (venueUid) {
            error = editNonUserVenue({
                contactPerson, venueEmail, phoneNumber, website, fb, venueType, genre,
                capacity, date: new Date(date).toJSON(), businessPlan, description, comments, isLazarya,
                paidEntrance, name, venueSize, hasLocalAudience, hasGuarantee, image, ...locationProps,
            })
        } else {
            error = createNonUserVenue({
                contactPerson, venueEmail, phoneNumber, website, fb, venueType, genre,
                capacity, date: new Date(date).toJSON(), businessPlan, description, comments, isLazarya,
                paidEntrance, name, venueSize, hasLocalAudience, hasGuarantee, image, ...locationProps,
            })
        }
        if (error && error.then) {
            error.then(venue => {
                // debugger
                console.log(' new venue ===', venue)
                // this.props.history.push(`/venue/${venue.uid}`)
            }).catch(err => {
                // TODO handle errors
                console.log('error ===', err)
            })
        } else {
            switch (error) {
                case 'login':
                    return this.setState({ error: 'Please Login to Create Venue', errors: [] })
                case 'admin':
                this.props.history.push('/')
                    break
                    default:
                this.setState({error: '', errors: []})
                break
            }
        }

        this.onModalClose()
    }
    getModalquestion = () => {
        const { match: { params: { venueUid } } } = this.props
        const {
            image, paidEntrance, venueSize, hasLocalAudience, hasGuarantee, isLazarya, contactPerson, venueEmail,
            phoneNumber, website, fb, venueType, genre, capacity, date, businessPlan, description, comments,
            location, name,
        } = this.state
        const locationProps = {}
        Object.keys(location).forEach(itemKey => locationProps[`location${capitalize(itemKey)}`] = location[itemKey])
        const values = {
            contactPerson, venueEmail, phoneNumber, website, fb, venueType, genre, capacity, date: new Date(date).toJSON(), businessPlan,
            description, comments, isLazarya, paidEntrance, venueSize, hasLocalAudience, hasGuarantee, image, name, ...locationProps,
        }
        return (
            <div>
                <h3>Are you sure you want to {venueUid ? 'update this venue' : 'create a new venue'} with these values?</h3>
                <br/>
                <h4>without these values</h4>
                {Object.keys(values).map((itemKey, index) => !values[itemKey] && <p key={`${itemKey}_empty_value${index}`} style={{
                    display: 'inline-block',
                    margin: '5px'
                }}>
                    <span style={{ color: 'red' }}>{itemKey}</span>,
                </p>)}
                <br />
                <h4>and with these values</h4>
                {Object.keys(values).map((itemKey, index) => values[itemKey] && <p
                key={`${itemKey}_full_value${index}`}
                style={{
                    display: 'inline-block',
                    margin: '5px'
                    }}>
                    <span style={{ color: 'green'}}>{itemKey}</span>: {values[itemKey]}
                </p>)}
            </div>
        )
    }

    onFileChange = e => {
        readFile(e.target.files, venue => {
            this.setState({image: venue.target.result})
        })
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
    onLazaryaChange = e => {this.setState({ isLazarya: !this.state.isLazarya })}
    onLocalAudienceChange = e => this.setState({ hasLocalAudience: !this.state.hasLocalAudience })
    onPaidEntranceChange = e => this.setState({ paidEntrance: !this.state.paidEntrance })
    onGuaranteeChange = e => this.setState({ hasGuarantee: !this.state.hasGuarantee })
    onContactChange = e => this.setState({ contactPerson: e.target.value })
    onEmailChange = e => this.setState({ venueEmail: e.target.value })
    onPhoneChange = e => this.setState({ phoneNumber: e.target.value })
    onSiteChange = e => this.setState({ website: e.target.value })
    onFBChange = e => this.setState({ fb: e.target.value })
    onVenueTypeChange = e => this.setState({ venueType: e.target.value })
    onGenreChange = e => this.setState({ genre: e.target.value })
    onCapacityChange = e => this.setState({ capacity: e.target.value })
    onDateChange = e => this.setState({ date: e.target.value })
    onBusinessPlanChange = e => this.setState({ businessPlan: e.target.value })
    onDescriptionChange = e => this.setState({ description: e.target.value })
    onCommentsChange = e => this.setState({ comments: e.target.value })
    onNameChange = e => this.setState({ name: e.target.value })

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
        const { match: { params: { venueUid } } } = this.props
        const {
            image, error, paidEntrance, venueSize, hasLocalAudience, hasGuarantee, location, isLazarya,
            contactPerson, venueEmail, name, phoneNumber, website, fb, venueType, genre, capacity,
            date, businessPlan, description, comments, isModalOpen,
        } = this.state
        return (
            <div className="container">
                <h3>{venueUid ? 'Edit' : 'Create'} Venue</h3>
                <button onClick={this.clearValues}>Clear Fields</button>
                <form onSubmit={this.onSubmit}>
                    {error && <div className="error" >{error}</div>}
                    <div className="form-group">
                        <Checkbox
                            checked={isLazarya}
                            onChange={this.onLazaryaChange}
                            label="Is from Lazarya?"
                        />
                    </div>
                    <Input
                        isRequired
                        className={this.getError('name')}
                        value={name}
                        id="venueName"
                        label="Name"
                        type="text"
                        onChange={this.onNameChange}
                        placeholder="Venue Name*"
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
                    <Input
                        className={this.getError('contactPerson')}
                        value={contactPerson}
                        id="contactPerson"
                        label="Contact Person"
                        type="text"
                        onChange={this.onContactChange}
                        placeholder="Venue Contact Person"
                        />
                    <Input
                        className={this.getError('venueEmail')}
                        value={venueEmail}
                        id="email"
                        label="Email"
                        type="email"
                        onChange={this.onEmailChange}
                        placeholder="example@example.com"
                        />
                    <Input
                        className={this.getError('phone')}
                        id="phoneNumber"
                        label="Phone number"
                        type="tel"
                        value={phoneNumber}
                        onChange={this.onPhoneChange}
                        placeholder="XXX-XXXXXXX"
                        />
                    <Input
                        className={this.getError('website')}
                        id="website"
                        value={website}
                        label="Website"
                        type="url"
                        onChange={this.onSiteChange}
                        placeholder="www.something.co..."
                        />
                    <Input
                        className={this.getError('fb')}
                        value={fb}
                        id="fb"
                        label="Facebook"
                        type="url"
                        onChange={this.onFBChange}
                        placeholder="www.facebook.com/username..."
                    />
                    <Input
                        className={this.getError('venueType')}
                        id="venueType"
                        value={venueType}
                        label="Type of venue"
                        type="text"
                        onChange={this.onVenueTypeChange}
                        placeholder="Type of venue"
                    />
                    <Input
                        className={this.getError('genre')}
                        id="venueGenre"
                        value={genre}
                        label="Genre"
                        type="text"
                        onChange={this.onGenreChange}
                        placeholder="Genre"
                    />
                    <Input
                        className={this.getError('capacity')}
                        id="venueCapacity"
                        label="Capacity"
                        value={capacity}
                        type="number"
                        onChange={this.onCapacityChange}
                        placeholder="200"
                    />
                    <Input
                        className={this.getError('date')}
                        id="venueLastEdit"
                        label="Last edited"
                        type="date"
                        value={date}
                        onChange={this.onDateChange}
                        placeholder="Last edited"
                    />
                    <RadioButtons
                        label="Venue size"
                        checked={venueSize}
                        name="optionsVenueSizeRadios"
                        onChange={this.checkSize}
                        options={[
                            'S', 'M', 'L', 'XL'
                        ]}
                    />
                    <div className="form-group">
                        <Checkbox 
                            checked={hasLocalAudience}
                            onChange={this.onLocalAudienceChange}
                            label="Has local Audience?"
                        />
                        <Checkbox 
                            checked={paidEntrance}
                            onChange={this.onPaidEntranceChange}
                            label="Has paid entrance?"
                        />
                        <Checkbox 
                            checked={hasGuarantee}
                            onChange={this.onGuaranteeChange}
                            label="Has Guarantee?"
                        />
                    </div>
                    <Input
                        className={this.getError('businessPlan')}
                        id="businessPlan"
                        label="Business Plan"
                        type="text"
                        value={businessPlan}
                        onChange={this.onBusinessPlanChange}
                        placeholder="Business Plan"
                    />
                    <Input
                        className={this.getError('description')}
                        id="description"
                        label="Description"
                        type="text"
                        value={description}
                        onChange={this.onDescriptionChange}
                        placeholder="Description..."
                    />
                    <Input
                        className={this.getError('comments')}
                        id="comments"
                        label="Comments"
                        type="text"
                        value={comments}
                        onChange={this.onCommentsChange}
                        placeholder="Comments..."
                    />
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
                {isModalOpen && <Modal question={this.getModalquestion()} onConfirm={this.onConfirm} onClose={this.onModalClose} />}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    trans: state.locale.trans,
})

export default connect(mapStateToProps)(CreateVenue)