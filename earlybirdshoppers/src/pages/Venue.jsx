import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { events, venues } from '../helpers/mockData'
import NotFound from './NotFound'
import EventItem from '../components/EventItem/'
import Loader from '../components/Loader/'
import { getVenue } from '../helpers/firebase'
import { pageView } from '../helpers/analytics'
import OpenChat from '../components/OpenChat/'
import Map from '../components/Map'
import '../components/VenueItem/VenueItem.css'

class Venue extends Component {
    state = {
        venue: null
    }

    componentDidMount() {
        pageView();

        const { id } = this.props.match.params
        let venue = venues.find(venue => parseInt(id,10) === venue.id)

        if (!venue) {
            getVenue(id, snapshot => {
                venue = snapshot.val()
                this.setState({ venue: venue || 'not found' })
            })
            .catch(snapshot => {
                this.setState({ venue: 'not found' })
            })
        } else {
            this.setState({ venue })
        }
    }

    render() {     
        // TODO if the Venue belongs to the user show edit options
        const {venue} = this.state
        let content
        
        if(venue === 'not found') {
            return <NotFound />
        } else if(!venue) {
            return <Loader />
        }

        if(venue.location) {
            const {
                events: venueEvents,
                location,
                name,
                openDates,
            } = venue
            const currentEvents = events.filter(event => venueEvents.indexOf(event.id) !== -1)

            content = (
                <div className="page-content">
                    <h3>Venue name: {name}</h3>
                    <h4>Based in: {location}</h4>
                    <h4>Open dates: {openDates.join(', ')}</h4>
                    <h4>Events:</h4>
                    <div className="row">
                        {currentEvents.map(event => <EventItem key={`event_item_${event.id}`} {...event} /> )}
                    </div>
                </div>
            )
        } else {
            const {
                displayName, uid, photoURL, locationLng, locationLat,
                name, locationAddress, locationCity, locationCountry, locationCountryShortName,
                venueSize, contactPerson, isLazarya, email, sittingCapacity,
                image, paidEntrance, hasLocalAudience, hasGuarantee, venueEmail, guaranteeAmount,
                phoneNumber, website, fb, venueType, genre, capacity, date, businessPlan, description, comments,
            } = venue
            const { userId, isLoggedIn, isAdmin } = this.props
            content = (<div className="page-content">
                {isAdmin && (isLazarya || uid === userId) && <Link to={`/admin/edit-venue/${uid}`} className="btn btn-default">Edit This Venue</Link>}
                {(venueEmail || email) && <p> email: {venueEmail || email} </p>}
                            {isLoggedIn && uid !== userId && !isLazarya && (
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
                            {venueSize && <p> size: {venueSize} </p>}
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
                            {sittingCapacity && <p>sittingCapacity: {sittingCapacity}</p>}
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
                        </div>)
        }


        console.log('venue', venue)
        return (
            <div className="page">
                {content}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.loggedIn,
    userId: state.auth.user && state.auth.user.uid,
    isAdmin: state.auth.user && state.auth.user.isAdmin,
})

export default connect(mapStateToProps)(Venue)