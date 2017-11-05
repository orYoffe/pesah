import React, { Component } from 'react'
import store from 'store'
import { connect } from 'react-redux'
import { getLocation, scrollToTop, capitalize, isEmailValid } from '../../helpers/common'
import { createNonUserVenue, getVenue, updateNonUserVenue } from '../../helpers/firebase'
import GSearchInput from '../GSearchInput/'
import Input from '../Input'
import Checkbox from '../Checkbox'
import RadioButtons from '../RadioButtons'
import Map from '../Map'
import Modal from '../Modal'
import Dropdown from '../Dropdown'

const LOCALSTORAGE_CREATE_VENUE_KEY = 'create_venue_admin_values'

const defaultValues = {
    isModalOpen: false,
    error: '',
    errors: [],
    activityDays: [],
    paidEntrance: false,
    stageSize: '',
    venueSize: '',
    hasLocalAudience: false,
    hasDrumkit: false,
    hasPiano: false,
    hasPA: false,
    hasGuarantee: false,
    openingTimeStart: false,
    openingTimeEnd: false,
    guaranteeAmount: 0,
    guaranteeMaxAmount: 0,
    location: false,
    isLazarya: true,
    contactPerson: '',
    venueEmail: '',
    contactPersonEmail: '',
    phoneNumber: '',
    contactPersonPhoneNumber: '',
    website: '',
    fb: '',
    venueType: '',
    genre: '',
    capacity: 0,
    seatingCapacity: 0,
    date: '',
    businessPlan: '',
    description: '',
    comments: '',
    equipment: '',
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

    isValid = ({ name, location, contactPersonEmail, venueEmail }) => {
        const errors = []
        let error = ''
        
        if (name.length < 4) {
            errors.push('name')
            error = `

            Name must be longer than 3 chars
            `
        }
        
        if (venueEmail.length > 0 && !isEmailValid(venueEmail)) {
            errors.push('venueEmail')
            error = `

            Venue email must be a valid email
            `
        }
        
        if (contactPersonEmail.length > 0 && !isEmailValid(contactPersonEmail)) {
            errors.push('contactPersonEmail')
            error = `

            Contact person email must be a valid email
            `
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
        const { location, name, contactPersonEmail, venueEmail } = this.state
        
        if (this.isValid({ name, location, contactPersonEmail, venueEmail })) {
            this.setState({isModalOpen: 'submit'})
        }
    }
    onConfirm = () => {
        const {
            paidEntrance, venueSize, stageSize, hasLocalAudience, hasGuarantee, isLazarya, contactPerson,
            venueEmail, phoneNumber, website, fb, venueType, genre, capacity, seatingCapacity, date, openingTimeEnd,
            businessPlan, description, comments, name, location, guaranteeAmount, equipment, hasDrumkit,
            hasPiano, hasPA, activityDays, contactPersonPhoneNumber, contactPersonEmail, guaranteeMaxAmount, openingTimeStart,
        } = this.state
        const { match: { params: { venueUid } } } = this.props
        let error

        const locationProps = {}
        Object.keys(location).forEach(itemKey => locationProps[`location${capitalize(itemKey)}`] = location[itemKey])
    
        console.log('submit============ ', {
            contactPerson, venueEmail, phoneNumber, website, fb, venueType, genre,
            capacity, seatingCapacity, date: new Date(date).toJSON(), businessPlan, description, comments, isLazarya, equipment,
            paidEntrance, name, venueSize, stageSize, hasLocalAudience, hasGuarantee, ...locationProps, guaranteeAmount, hasDrumkit,
            hasPiano, hasPA, activityDays, contactPersonPhoneNumber, contactPersonEmail, guaranteeMaxAmount, openingTimeStart, openingTimeEnd,
        })
        if (venueUid) {
            error = updateNonUserVenue({
                uid: venueUid,
                contactPerson, venueEmail, phoneNumber, website, fb, venueType, genre,
                capacity, seatingCapacity, date: new Date(date).toJSON(), businessPlan, description, comments, isLazarya, equipment,
                paidEntrance, name, venueSize, stageSize, hasLocalAudience, hasGuarantee, ...locationProps, guaranteeAmount, hasDrumkit,
                hasPiano, hasPA, activityDays, contactPersonPhoneNumber, contactPersonEmail, guaranteeMaxAmount, openingTimeStart, openingTimeEnd,
            })
        } else {
            error = createNonUserVenue({
                contactPerson, venueEmail, phoneNumber, website, fb, venueType, genre,
                capacity, seatingCapacity, date: new Date(date).toJSON(), businessPlan, description, comments, isLazarya, equipment,
                paidEntrance, name, venueSize, stageSize, hasLocalAudience, hasGuarantee, ...locationProps, guaranteeAmount, hasDrumkit,
                hasPiano, hasPA, activityDays, contactPersonPhoneNumber, contactPersonEmail, guaranteeMaxAmount, openingTimeStart, openingTimeEnd,
            })
        }
        if (error && error.then) {
            error.then(venue => {
                if (venue.errorCode && venue.errorCode !== 200) {
                    console.log(' error ===', venue)
                    this.setState({ isModalOpen: 'error' })
                } else {
                    console.log(' new venue ===', venue)
                    this.props.history.push(`/venue/${venue.uid}`)
                }
            }).catch(err => {
                console.log('error ===', err)
                this.setState({ isModalOpen: 'error' })
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
    getModalQuestion = () => {
        const { match: { params: { venueUid } } } = this.props
        const {
            paidEntrance, venueSize, stageSize, hasLocalAudience, hasGuarantee, isLazarya, contactPerson, venueEmail, equipment,
            phoneNumber, website, fb, venueType, genre, capacity, seatingCapacity, date, businessPlan, description, comments,
            location, name, guaranteeAmount, hasDrumkit, contactPersonEmail, guaranteeMaxAmount, openingTimeStart, openingTimeEnd,
            hasPiano, hasPA, activityDays, contactPersonPhoneNumber,
        } = this.state
        const locationProps = {}
        Object.keys(location).forEach(itemKey => locationProps[`location${capitalize(itemKey)}`] = location[itemKey])
        const values = {
            contactPerson, venueEmail, phoneNumber, website, fb, venueType, genre, capacity, seatingCapacity, date: new Date(date).toJSON(), businessPlan,
            description, comments, equipment, isLazarya, paidEntrance, venueSize, stageSize, openingTimeStart,
            hasLocalAudience, hasGuarantee, name, ...locationProps, guaranteeAmount, hasDrumkit, openingTimeEnd,
            hasPiano, hasPA, activityDays, contactPersonPhoneNumber, contactPersonEmail, guaranteeMaxAmount,
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

    checkSize = e => this.setState({venueSize: e.target.value})
    onStageSizeSelect = e => this.setState({stageSize: e.target.value})
    onLazaryaChange = e => {this.setState({ isLazarya: !this.state.isLazarya })}
    onLocalAudienceChange = e => this.setState({ hasLocalAudience: !this.state.hasLocalAudience })
    onPaidEntranceChange = e => this.setState({ paidEntrance: !this.state.paidEntrance })
    onContactChange = e => this.setState({ contactPerson: e.target.value })
    onEmailChange = e => this.setState({ venueEmail: e.target.value })
    onPhoneChange = e => this.setState({ phoneNumber: e.target.value })
    onContactPersonPhoneNumberChange = e => this.setState({ contactPersonPhoneNumber: e.target.value })
    onSiteChange = e => this.setState({ website: e.target.value })
    onFBChange = e => this.setState({ fb: e.target.value })
    onVenueTypeChange = e => this.setState({ venueType: e.target.value })
    onGenreChange = e => this.setState({ genre: e.target.value })
    onCapacityChange = e => this.setState({ capacity: e.target.value })
    onseatingCapacityChange = e => this.setState({ seatingCapacity: e.target.value })
    onGuaranteeChange = e => {
        if (this.state.hasGuarantee) {
            this.setState({ hasGuarantee: !this.state.hasGuarantee, guaranteeAmount: 0, guaranteeMaxAmount: 0 })
        } else {
            this.setState({ hasGuarantee: !this.state.hasGuarantee })
        }
    }
    onActivityDaysChange = field => e => {
        const activityDays = this.state.activityDays.slice()
        if (activityDays.includes(field)) {
            activityDays.splice(activityDays.indexOf(field), 1)
        } else {
            activityDays.push(field)
        }
        this.setState({ activityDays })
    }
    weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    toggleActivityDays = e => {
        e && e.preventDefault()
        this.setState({
            activityDays: this.state.activityDays.length ? [] : this.weekDays
        })
    }
    onGuaranteeAmountChange = e => this.setState({ guaranteeAmount: e.target.value })
    onGuaranteeMaxAmountChange = e => this.setState({ guaranteeMaxAmount: e.target.value })
    onDrumkitChange = e => this.setState({ hasDrumkit: e.target.value })
    onPianoChange = e => this.setState({ hasPiano: e.target.value })
    onPAChange = e => this.setState({ hasPA: e.target.value })
    onDateChange = e => this.setState({ date: e.target.value })
    onBusinessPlanChange = e => this.setState({ businessPlan: e.target.value })
    onDescriptionChange = e => this.setState({ description: e.target.value })
    onCommentsChange = e => this.setState({ comments: e.target.value })
    onEquipmentChange = e => this.setState({ equipment: e.target.value })
    onNameChange = e => this.setState({ name: e.target.value })
    onContactPersonEmailChange = e => this.setState({ contactPersonEmail: e.target.value })
    onOpeningTimeStartChange = e => this.setState({ openingTimeStart: e.target.value })
    onOpeningTimeEndChange = e => this.setState({ openingTimeEnd: e.target.value })

    onPlacesChanged = () => {
        const place = this.venueLocation.getPlaces()[0]
        const location = getLocation(place)
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
            error, paidEntrance, venueSize, stageSize, hasLocalAudience, hasGuarantee, location, isLazarya, hasDrumkit,
            contactPerson, venueEmail, name, phoneNumber, website, fb, venueType, genre, capacity, seatingCapacity, guaranteeAmount,
            date, businessPlan, description, comments, isModalOpen, equipment, contactPersonPhoneNumber,
            hasPiano, hasPA, activityDays, contactPersonEmail, guaranteeMaxAmount, openingTimeStart, openingTimeEnd,
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
                        className={this.getError('name') + ' col-md-6'}
                        value={name}
                        id="venueName"
                        label="Name"
                        type="text"
                        onChange={this.onNameChange}
                        placeholder="Venue Name*"
                        />
                    <Input
                        className={this.getError('phone') + ' col-md-6'}
                        id="phoneNumber"
                        label="Venue Phone number"
                        type="tel"
                        value={phoneNumber}
                        onChange={this.onPhoneChange}
                        placeholder="XXX-XXXXXXX"
                        />
                    <Input
                        className={this.getError('venueEmail') + ' col-md-6'}
                        value={venueEmail}
                        id="email"
                        label="Venue Email"
                        type="email"
                        onChange={this.onEmailChange}
                        placeholder="example@example.com"
                        />
                    <Input
                        className={this.getError('contactPerson') + ' col-md-6'}
                        value={contactPerson}
                        id="contactPerson"
                        label="Contact Person"
                        type="text"
                        onChange={this.onContactChange}
                        placeholder="Venue Contact Person"
                        />
                    <Input
                        className={this.getError('contactPersonPhoneNumber') + ' col-md-6'}
                        id="contactPersonPhoneNumber"
                        label="Contact person Phone number"
                        type="tel"
                        value={contactPersonPhoneNumber}
                        onChange={this.onContactPersonPhoneNumberChange}
                        placeholder="XXX-XXXXXXX"
                        />
                    <Input
                        className={this.getError('contactPersonEmail') + ' col-md-6'}
                        value={contactPersonEmail}
                        id="contactPersonEmail"
                        label="Contact person Email"
                        type="email"
                        onChange={this.onContactPersonEmailChange}
                        placeholder="example@example.com"
                        />
                    <Input
                        className={this.getError('website') + ' col-md-6'}
                        id="website"
                        value={website}
                        label="Website"
                        type="url"
                        onChange={this.onSiteChange}
                        placeholder="www.something.co..."
                        />
                    <Input
                        className={this.getError('fb') + ' col-md-6'}
                        value={fb}
                        id="fb"
                        label="Facebook"
                        type="url"
                        onChange={this.onFBChange}
                        placeholder="www.facebook.com/username..."
                    />
                    <Input
                        className={this.getError('venueType') + ' col-md-6'}
                        id="venueType"
                        value={venueType}
                        label="Type of venue"
                        type="text"
                        onChange={this.onVenueTypeChange}
                        placeholder="Type of venue"
                    />
                    <Input
                        className={this.getError('genre') + ' col-md-6'}
                        id="venueGenre"
                        value={genre}
                        label="Genre"
                        type="text"
                        onChange={this.onGenreChange}
                        placeholder="Genre"
                    />
                    <Input
                        className={this.getError('capacity') + ' col-md-6'}
                        id="venueCapacity"
                        label="Capacity"
                        value={capacity}
                        type="number"
                        onChange={this.onCapacityChange}
                        placeholder="200"
                    />
                    <Input
                        className={this.getError('seatingCapacity') + ' col-md-6'}
                        id="seatingCapacity"
                        label="Sitting Capacity"
                        value={seatingCapacity}
                        type="number"
                        onChange={this.onseatingCapacityChange}
                        placeholder="100"
                    />
                    <Input
                        className={this.getError('date') + ' col-md-6'}
                        id="venueLastEdit"
                        label="Last edited"
                        type="date"
                        value={date}
                        onChange={this.onDateChange}
                        placeholder="Last edited"
                    />
                    <Input
                        className={this.getError('businessPlan') + ' col-md-6'}
                        id="businessPlan"
                        label="Business Plan"
                        type="text"
                        value={businessPlan}
                        onChange={this.onBusinessPlanChange}
                        placeholder="Business Plan"
                    />
                    <Input
                        className={this.getError('description') + ' col-md-6'}
                        id="description"
                        label="Description"
                        type="text"
                        value={description}
                        onChange={this.onDescriptionChange}
                        placeholder="Description..."
                    />
                    <Input
                        className={this.getError('comments') + ' col-md-6'}
                        id="comments"
                        label="Comments"
                        type="text"
                        value={comments}
                        onChange={this.onCommentsChange}
                        placeholder="Comments..."
                    />

                    <Dropdown
                        className="col-md-6"
                        value={stageSize}
                        onSelect={this.onStageSizeSelect}
                        options={[
                            {value: 'S'},
                            {value: 'M'},
                            {value: 'L'},
                            {value: 'XL'},
                        ]}
                        label="Stage size"
                        id="venue_stage_size"
                    />
                    <RadioButtons
                        className="col-md-6"
                        label="Venue size"
                        checked={venueSize}
                        name="optionsVenueSizeRadios"
                        onChange={this.checkSize}
                        options={[
                            'S', 'M', 'L', 'XL'
                        ]}
                    />
                    <div className="form-group col-md-6">
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
                    {hasGuarantee && <Input
                        className={this.getError('guaranteeAmount') + ' col-md-6'}
                        id="guaranteeAmount"
                        label="Guarantee Amount"
                        value={guaranteeAmount}
                        type="number"
                        onChange={this.onGuaranteeAmountChange}
                        placeholder="3500"
                    />}
                    {hasGuarantee && <Input
                        className={this.getError('guaranteeMaxAmount') + ' col-md-6'}
                        id="guaranteeMaxAmount"
                        label="Guarantee Max Amount"
                        value={guaranteeMaxAmount}
                        type="number"
                        onChange={this.onGuaranteeMaxAmountChange}
                        placeholder="3500"
                    />}
                    <Input
                        className={this.getError('equipment') + ' col-md-6'}
                        id="equipment"
                        label="Equipment list"
                        type="text"
                        value={equipment}
                        onChange={this.onEquipmentChange}
                        placeholder="7 guitars and 3 AKG microphones..."
                    />
                    <div className="form-group col-md-6">
                        <Checkbox
                            checked={hasDrumkit}
                            onChange={this.onDrumkitChange}
                            label="Has drum kit?"
                        />
                        <Checkbox
                            checked={hasPiano}
                            onChange={this.onPianoChange}
                            label="Has Piano on location?"
                        />
                        <Checkbox
                            checked={hasPA}
                            onChange={this.onPAChange}
                            label="Has a PA system on location?"
                        />
                    </div>
                    <div className="form-group col-md-6">
                        Activity days <button onClick={this.toggleActivityDays} className="btn btn-default">toggle all days</button>
                        <Checkbox
                            checked={activityDays.includes('Monday')}
                            onChange={this.onActivityDaysChange('Monday')}
                            label="Monday"
                        />
                        <Checkbox
                            checked={activityDays.includes('Tuesday')}
                            onChange={this.onActivityDaysChange('Tuesday')}
                            label="Tuesday"
                        />
                        <Checkbox
                            checked={activityDays.includes('Wednesday')}
                            onChange={this.onActivityDaysChange('Wednesday')}
                            label="Wednesday"
                        />
                        <Checkbox
                            checked={activityDays.includes('Thursday')}
                            onChange={this.onActivityDaysChange('Thursday')}
                            label="Thursday"
                        />
                        <Checkbox
                            checked={activityDays.includes('Friday')}
                            onChange={this.onActivityDaysChange('Friday')}
                            label="Friday"
                        />
                        <Checkbox
                            checked={activityDays.includes('Saturday')}
                            onChange={this.onActivityDaysChange('Saturday')}
                            label="Saturday"
                        />
                        <Checkbox
                            checked={activityDays.includes('Sunday')}
                            onChange={this.onActivityDaysChange('Sunday')}
                            label="Sunday"
                        />
                    </div>
                    <Input
                        className={this.getError('openingTimeStart') + ' col-md-6'}
                        id="openingTimeStart"
                        label="Opening time"
                        type="time"
                        value={openingTimeStart}
                        onChange={this.onOpeningTimeStartChange}
                    />
                    <Input
                        className={this.getError('openingTimeEnd') + ' col-md-6'}
                        id="openingTimeEnd"
                        label="Closing time"
                        type="time"
                        value={openingTimeEnd}
                        onChange={this.onOpeningTimeEndChange}
                    />
                    <br/>
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
                                <br />
                                country: {location.country}
                                <br />
                                countryShortName: {location.countryShortName}
                                <br />
                                district: {location.district}
                                <br />
                                address: {location.address}
                                <br />
                                intphone: {location.intphone}
                                <br />
                                phone: {location.phone}
                                <br />
                                name: {location.name}
                                <br />
                                lat: {location.lat}
                                <br />
                                lng: {location.lng}
                                <br />
                                website: {location.website}
                                <br />
                            </p>
                            <Map markers={[
                                {
                                    position: { lng: location.lng, lat: location.lat }
                                },
                            ]} />
                        </div>
                    )}
                    <input
                        className="btn btn-primary form-control"
                        onClick={this.onSubmit}
                        type="submit"
                        value={venueUid ? 'Update Venue' : "Create Venue"}
                    />

                </form>
                {isModalOpen === 'submit' && <Modal question={this.getModalQuestion()} onConfirm={this.onConfirm} onClose={this.onModalClose} />}
                {isModalOpen === 'error' && <Modal question={<div>we got an error the data wasn't uploaded to the database</div>} onClose={this.onModalClose} />}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    trans: state.locale.trans,
})

export default connect(mapStateToProps)(CreateVenue)