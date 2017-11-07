import React, { Component } from 'react'
import moment from 'moment'
import store from 'store'
import { connect } from 'react-redux'
// import '../UserItem.css'
// import './CreateEvent.css'
import {
    ifLessThanTen,
    // readFile,
    howManyTickets
} from '../../helpers/common'
import { createEvent } from '../../helpers/db/event'
import GSearchInput from '../GSearchInput/'

const LOCALSTORAGE_CREATEEVENT_KEY = 'create_event_values'

class CreateEvent extends Component {
    state = {
        numberOfTickets: null,
        image: null,
        error: '',
        errors: [],
        values: null
    }

    componentDidMount() {
        // TODO keep values in local storage better
        const storedValues = store.get(LOCALSTORAGE_CREATEEVENT_KEY)
        if (storedValues) {
            this.setState({values: storedValues})
        }
    }
    // componentWillUpdate(nextProps, nextState) {
    //     // TODO keep values in local storage better
    //     const storedValues = store.get(LOCALSTORAGE_CREATEEVENT_KEY)
    //     if (storedValues) {
    //         this.setState({values: storedValues})
    //     }
    // }

    isValid = ({
        title, date, location, venue, artist, price, accountType, goal, time
    }) => {
        const errors = []
        let error = ''
        
        if (title.length < 5) {
            errors.push('title')
            error = `

            Title must be longer than 4 chars
            `
        }
        
        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
            errors.push('date')
            error = `${error}

            Date is required
            `
        } else {
            const now = new Date()
            if (new Date(date).getTime() <= now.getTime()) {
                errors.push('date')
                error = `${error}

                Date must be in the future
                `
            }
        }
        if (!moment(time, 'HH:mm', true).isValid()) {
            errors.push('time')
            error = `${error}

            Time is required
            `
        }
        if (
            !location ||
            !location.address_components ||
            !location.address_components
            .find(prop => prop.types.indexOf('country') !== -1) ||
            !location.address_components
                .find(prop => prop.types.indexOf('locality') !== -1)
            ) {
            errors.push('location')
            error = `${error}

            Location is required
            `
        }
        if (accountType === 'artist' && venue.length < 5) {
            errors.push('venue')
            error = `${error}
            Venue must be longer than 4 chars
            `
        }
        if (accountType === 'venue' && artist.length < 5) {
            errors.push('artist')
            error = `${error}
            Artists must be longer than 4 chars
            `
        }
        // TODO fix validation for price and goal
        if (isNaN(parseInt(price, 10)) || parseInt(price, 10) < 0) {
            errors.push('price')
            error = `${error}
            Price is required
            `
        }
        if (isNaN(parseInt(goal, 10)) || parseInt(goal, 10) < 0 || parseInt(goal, 10) <= parseInt(price, 10)) {
            errors.push('goal')
            error = `${error}
            Bar goal is required and must be higher than ticket price
            `
        }

        if (errors.length) {
            this.setState({ error, errors })
            return false
        }

        return true
    }
    
    onSubmit = e => {
        e.preventDefault()
        const { trans, accountType } = this.props
        const { image } = this.state
        let venue
        let artist

        const places = this.eventLocation.getPlaces() || []
        
        const title = this.eventTitle.value.trim()
        const date = this.eventDate.value
        const time = this.time.value
        const price = this.ticketPrice.value
        const goal = this.goal.value
        const currency = trans.currency
        const location = places[0]
        if (accountType === 'artist') {
            venue = this.venue.value.trim() 
        } else {
            artist = this.artist.value.trim() 
        }
        // TODO connect to real venues
        // TODO if venue is not in platform add details and add venue
        const photoURL = image
        
        if (this.isValid({
            title, date, time, location, venue, artist, price, goal, accountType
        })) {
            const error = createEvent({
                title, date: new Date(date).toJSON(), time, price, goal,
                currency, location, venue, artist, photoURL, accountType,
            })
            if (error && error.then) {
                error.then(event => {
                    // debugger
                    console.log(' new event ===', event)
                    // this.props.history.push(`/event/${event.uid}`)
                }).catch(err => {
                    // TODO handle errors
                    console.log('error ===', err)
                })
            } else {
                switch (error) {
                    case 'login':
                        return this.setState({ error: 'Please Login to Create Event', errors: [] })
                    case 'verifyemail':
                        return this.setState({
                            error: 'Please verify your email in order to Create Event you need to verify your email',
                            errors: []
                        })
                    default:
                    this.setState({error: '', errors: []})
                        break
                }
            }
        }
    }

    onFileChange = e => {
        e.stopPropagation();
        e.preventDefault();
        // const file = e.target.files[0];
        // const metadata = {
        //     'contentType': file.type
        // };
        // // Push to child path.
        // // [START oncomplete]
        // storageRef.child('images/' + file.name).put(file, metadata).then(function (snapshot) {
        //     console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        //     console.log(snapshot.metadata);
        //     const url = snapshot.downloadURL;
        //     console.log('File available at', url);
        //     // [START_EXCLUDE]
        //     document.getElementById('linkbox').innerHTML = '<a href="' + url + '">Click For File</a>';
        //     // [END_EXCLUDE]
        // }).catch(function (error) {
        //     // [START onfailure]
        //     console.error('Upload failed:', error);
        //     // [END onfailure]
        // });
        // readFile(e.target.files, event => {
        //     this.setState({image: event.target.result})
        // })
    }

    renderHowMany = numberOfTickets => numberOfTickets && <p>Number of tickets required to reach Bar goal is {numberOfTickets} tickets</p>
    onPricingChange = () => {
        if (!this.ticketPrice || !this.goal) {
            return
        }

        const price = this.ticketPrice.value
        const goal = this.goal.value
        if (price < 0 || goal < 0) {
            if (this.state.numberOfTickets > 0) {
                this.setState({
                    numberOfTickets: null
                })
            }
            return
        }
        const numberOfTickets = parseInt(howManyTickets(price, goal), 10)

        if (!isNaN(numberOfTickets)) {
            this.setState({
                numberOfTickets
            })
        }
    }

    onInputChange = () => {
        const { accountType } = this.props
        // const { image } = this.state
        let venue
        let artist

        const places = this.eventLocation.getPlaces() || []
        
        const title = this.eventTitle.value.trim()
        const date = this.eventDate.value
        const time = this.time.value
        const price = this.ticketPrice.value
        const goal = this.goal.value
        const location = places[0]
        if (accountType === 'artist') {
            venue = this.venue.value.trim() 
        } else {
            artist = this.artist.value.trim() 
        }
        // const photoURL = image

        store.set(LOCALSTORAGE_CREATEEVENT_KEY, {
            title, date: date, time, price, goal,
            location, venue, artist,
        })
        this.onPricingChange()
    }

    onPlacesChanged = places => {} //console.log(this.eventLocation.getPlaces())
    
    render() {
        const { trans, accountType } = this.props
        const { image, error, errors, numberOfTickets, values } = this.state
        console.log('values=========', values)
        if (values) {
            store.set(LOCALSTORAGE_CREATEEVENT_KEY, values)
        }
        const now = new Date()
        const minDate = `${now.getFullYear()}-${ifLessThanTen(now.getDate())}-${ifLessThanTen(now.getMonth() + 1)}`
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    {error && <div className="error" >{error}</div>}
                    <div className={`form-group ${errors.indexOf('title') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="eventTitle">Event Title</label>
                        <input
                            ref={node => this.eventTitle = node}
                            required
                            value={values ? (values.title || '') : ''}
                            className="form-control"
                            type="text"
                            onChange={this.onInputChange}
                            id="eventTitle"
                            placeholder="Event Title" />
                    </div>
                    <div className={`form-group ${errors.indexOf('date') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="eventDate">Event Date</label>
                        <input
                            ref={node => this.eventDate = node}
                            required
                            value={values ? (values.date || '') : ''}
                            className="form-control"
                            type="date"
                            onChange={this.onInputChange}
                            min={minDate}
                            id="eventDate"
                            placeholder="Event Date" />
                    </div>
                    <div className={`form-group ${errors.indexOf('time') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="time">Event Time</label>
                        <input
                            ref={node => this.time = node}
                            required
                            value={values ? (values.time || '') : ''}
                            className="form-control"
                            onChange={this.onInputChange}
                            type="time"
                            id="time"
                            placeholder="Event time" />
                    </div>
                    <div className={`form-group ${errors.indexOf('price') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="ticketPrice">Ticket Price</label>
                        <input
                            ref={node => this.ticketPrice = node}
                            required
                            value={values ? (values.price || '') : ''}
                            className="form-control"
                            type="number"
                            onChange={this.onInputChange}
                            id="ticketPrice"
                            placeholder={`50${trans.currency}`}
                        />
                    </div>
                    <div className={`form-group ${errors.indexOf('goal') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="goal">Bar goal</label>
                        <input
                            ref={node => this.goal = node}
                            required
                            value={values ? (values.goal || '') : ''}
                            className="form-control"
                            onChange={this.onInputChange}
                            type="number"
                            id="goal"
                            placeholder={`5000${trans.currency}`}
                        />
                    </div>
                    {this.renderHowMany(numberOfTickets)}
                    <div className={`form-group ${errors.indexOf('location') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="eventLocation">Event Location</label>
                        <GSearchInput 
                            placeholder="Somewhere street 54"
                            className="form-control"
                            id="eventLocation"
                            refrence={node => this.eventLocation = node}
                            onPlacesChanged={this.onPlacesChanged}
                        />
                    </div>
                    {accountType === 'artist' && <div className={`form-group ${errors.indexOf('venue') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="venue">Venue</label>
                        <input
                            ref={node => this.venue = node}
                            required
                            value={values ? (values.venue || '') : ''}
                            className="form-control"
                            onChange={this.onInputChange}
                            type="text"
                            id="venue"
                            placeholder="Madison square garden" />
                    </div>}
                    {accountType === 'venue' && <div className={`form-group ${errors.indexOf('atrist') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="atrist">Artists</label>
                        <input
                            ref={node => this.atrist = node}
                            required
                            value={values ? (values.artist || '') : ''}
                            className="form-control"
                            onChange={this.onInputChange}
                            type="text"
                            id="atrist"
                            placeholder="Madison square garden" />
                    </div>}
                    <div className={`form-group ${errors.indexOf('eventPhoto') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="eventPhoto">Upload event cover</label>
                        <input
                            className="form-control"
                            type="file"
                            onChange={this.onFileChange}
                            id="eventPhoto" />
                    </div>
                    <br />
                    <input
                        className="btn btn-primary form-control"
                        onClick={this.onSubmit}
                        type="submit"
                        value="Create Event"
                    />
                    {image && [
                        <h5 key="event-cover-image-display-header">Event Cover</h5>,
                        <img src={image} alt="event cover" title="event cover" key="event-cover-image-display-picture" />
                    ]}
                </form>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    trans: state.locale.trans,
    accountType: state.auth.user && state.auth.user.accountType,
})

export default connect(mapStateToProps)(CreateEvent)