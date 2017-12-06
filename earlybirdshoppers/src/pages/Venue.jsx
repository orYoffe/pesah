import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import NotFound from './NotFound'
// import EventItem from '../components/EventItem/'
import Loader from '../components/Loader/'
import { getVenue, getArtist, requestBooking, findVenueByUrl } from '../helpers/firebase'
import { pageView } from '../helpers/analytics'
import OpenChat from '../components/OpenChat'
import Map from '../components/Map'
import Modal from '../components/Modal'
import Textarea from '../components/Textarea'
import FileInput from '../components/FileInput'
import BookingVenuePanel from '../components/Booking/BookingVenuePanel'
import '../components/VenueItem/VenueItem.css'

const defaultBookingMessage = 'Hi I would like to book an event at your venue :)'
const defaultState = {
    venue: null,
    artist: null,
    isModalOpen: false,
    bookingMessage: '',
}

class Venue extends Component {
    state = defaultState

    componentDidMount() {
        const { userId } = this.props
      const { id } = this.props.match.params
        pageView('venue', { page: id, userId })
            this.setState(defaultState)

        getVenue(id, snapshot => {
            const venue = snapshot && snapshot.val()
            this.setState({ venue: venue || 'not found' })
        })
        .catch(snapshot => {
            this.setState({ venue: 'not found' })
        })
    }

    onModalClose = () => this.setState({ isModalOpen: false })
    onBookingMessageChange = e => this.setState({ bookingMessage: e.target.value.trim() })
    getModalQuestion = () => {
        const { venue, bookingMessage } = this.state
        return (
            <div>
                <h4>Are you sure you want to send a booking request to {venue.displayName || venue.name}?</h4>
                <br/>

                <Textarea
                    type="text"
                    onChange={this.onBookingMessageChange}
                    label="Message (this message will be sent along with your request)"
                    placeholder={defaultBookingMessage}
                    value={bookingMessage}
                />
            </div>
        )
    }

    onBookingConfirm = () => {
        // TODO send api request to the venue for a booking request
        const { id } = this.props.match.params
        const { bookingMessage } = this.state
        requestBooking({ venueId: id, requestMessage: bookingMessage }, res => {
            if (res.message === 'ok') {
                this.setState({ isModalOpen: 'ConfirmBookingRequest' })
            } else if (res.errorMessage === 'already exists'){
                this.setState({ isModalOpen: 'alreadyExists' })
            } else {
                this.setState({ isModalOpen: 'error' })
            }
        }).catch(err => this.setState({ isModalOpen: 'error' }))
        this.onModalClose()
    }

    requestBooking = () => {
        const { userId } = this.props
        getArtist(userId, snapshot => {
            const artist = snapshot && snapshot.val()
            console.log('artist ======================', artist)
            this.setState({ artist, isModalOpen: 'booking' })
        })
            .catch(snapshot => {
                this.setState({ venue: 'not found' })
            })
    }
    renderBooking = () => {
        const { accountType } = this.props
        const { venue } = this.state
        if (accountType !== 'artist' || venue.hasUser === false) {
            return null
        }

        return <button onClick={this.requestBooking} className="btn btn-default">Book an Event with this Venue</button>
    }



    renderVenueEdit = () => {
        const { userId } = this.props
        const { id } = this.props.match.params

        if (userId === id) {
            return [<BookingVenuePanel uid={id} />,
            userId && <FileInput
                userUid={userId}
                filePurpose="profilePicture"
                label="Upload a profile picture"
                id="venue_profilePicture_upload_input"
            />]
        }
    }

    render() {
        // TODO if the Venue belongs to the user show edit options
        const { venue, isModalOpen } = this.state

        if(!venue) {
            return <Loader />
        }
        if(venue === 'not found') {
            return <NotFound />
        }

        const {
            displayName, uid, photoURL, locationLng, locationLat,
            name, locationAddress, locationCity, locationCountry, locationCountryShortName,
            venueSize, contactPerson, isLazarya, email, seatingCapacity, stageSize, hasUser,
            image, paidEntrance, hasLocalAudience, hasGuarantee, venueEmail, guaranteeAmount,
            phoneNumber, website, fb, venueType, genre, capacity, date, businessPlan, description, comments,
        } = venue
        const { userId, isLoggedIn, isAdmin, emailVerified } = this.props
        const content = (
            <div className="page-content">
                {this.renderBooking()}
                {this.renderVenueEdit()}
                {isAdmin && (isLazarya || uid === userId) && <Link to={`/admin/edit-venue/${uid}`} className="btn btn-default">Edit This Venue</Link>}
                {(venueEmail || email) && <p> email: {venueEmail || email} </p>}
                {isLoggedIn && emailVerified && uid !== userId && hasUser !== false && (
                        <OpenChat
                        chatPartner={{
                            uid: uid,
                            photo: photoURL || '',
                            displayName: displayName || name
                        }} />
                    )
                }
                {(displayName || name) && <h4>Venue name: {displayName || name}</h4>}
                {locationAddress && <p>Address: {locationAddress}</p>}
                {locationCity && <p>City: {locationCity}</p>}
                {locationCountry && <p>Country: {locationCountry}</p>}
                {locationCountryShortName && <p>CountryShortName: {locationCountryShortName}</p>}
                {venueSize && <p> venueSize: {venueSize} </p>}
                {stageSize && <p> stageSize: {stageSize} </p>}
                {contactPerson && <p> contactPerson: {contactPerson} </p>}
                {isLazarya && <p> *From Lazarya </p>}
                {paidEntrance && <p> *Has paid Entrance </p>}
                {hasLocalAudience && <p> *Has local audience </p>}
                {hasGuarantee && <p> *Has Guarantee </p>}
                {guaranteeAmount && <p>guaranteeAmount: {guaranteeAmount}</p>}
                {venueType && <p>venueType: {venueType}</p>}
                {phoneNumber && <p>phoneNumber: {phoneNumber}</p>}
                {genre && <p>genre: {genre}</p>}
                {capacity && <p>capacity: {capacity}</p>}
                {seatingCapacity && <p>seatingCapacity: {seatingCapacity}</p>}
                {businessPlan && <p>businessPlan: {businessPlan}</p>}
                {description && <p>description: {description}</p>}
                {comments && <p>comments: {comments}</p>}
                {date && <p>last edited: {date}</p>}
                {fb && <a href={fb} target="_blank" >FB link</a>}
                {website && <a href={website} target="_blank" >Website link</a>}
                {image && <img src={image} alt="venue"/>}
                {locationLng && locationLat && <Map markers={[
                    {
                        position: { lng: locationLng, lat: locationLat }
                    },
                ]} />}
            </div>
        )


        return (
            <div className="page">
                {content}
                {isModalOpen === 'booking' && (
                    <Modal
                    question={this.getModalQuestion()}
                    onConfirm={this.onBookingConfirm}
                    onClose={this.onModalClose}
                    confirmLabel="Yes, send it!"
                    cancelLabel="No, I'll wait" />
                )}
                {isModalOpen === 'alreadyExists' && <Modal question={<div>Your booking request was already created. Hopefully they will get back to you soon</div>} onClose={this.onModalClose} cancelLabel="Ok" />}
                {isModalOpen === 'ConfirmBookingRequest' && <Modal question={<div>Your booking request was sent to the venue. Hopefully they will get back to you soon</div>} onClose={this.onModalClose} cancelLabel="Ok" />}
                {isModalOpen === 'error' && <Modal question={<div>we got an error the data wasn't uploaded to the database</div>} onClose={this.onModalClose} />}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.loggedIn,
    userId: state.auth.user && state.auth.user.uid,
    accountType: state.auth.user && state.auth.user.accountType,
    isAdmin: state.auth.user && state.auth.user.isAdmin,
    emailVerified: state.auth.user && state.auth.user.emailVerified,
})

export default connect(mapStateToProps)(Venue)
