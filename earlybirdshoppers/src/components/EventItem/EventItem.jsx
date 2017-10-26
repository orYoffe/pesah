import React from 'react'
import moment from 'moment'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
import { artists, venues } from '../../helpers/mockData'
import '../UserItem.css'
import './EventItem.css'

const EventItem = props => {   
    if (props.id) {
        
        const {
            id,
            artists: eventArtists,
            date,
            location,
            name,
            venues: eventVenues,
            price,
        } = props
    
        const currentVenue = venues.find(venue => eventVenues[0] === venue.id)
        const currentArtists = artists.filter(artist => eventArtists.indexOf(artist.id) !== -1)
        
        return (
            <div className="col-sm-6 col-xs-12">
                <Link to={`/event/${id}`} className="event-item  user-item">
                    <div className="event-item-content user-item-content">
                        <h4>Event name: {name}</h4>
                        <p>Location: {location} at {currentVenue.name}</p>
                        <p>Price: {price}$</p>
                        <p>When: {moment(date).format('LLL')}</p>
                        <p>Who: {currentArtists.length && currentArtists.map(artist => artist.name).join(', ')}</p>
                    </div>
                </Link>
            </div>
        )
    }

    const {
            uid,
            title,
            date,
            location,
        artists: eventArtists,
        venue,
        price,
        managers,
        } = props

    return (
        <div className="col-sm-6 col-xs-12">
            <Link to={`/event/${uid}`} className="event-item  user-item">
                <div className="event-item-content user-item-content">
                    <h4>Event title: {title}</h4>
                    {location.address && <p>address: {location.address}</p>}
                    <p> at {venue}</p>
                    <p>city: {location.city}</p>
                    <p>coutry: {location.coutry}</p>
                    <p>Price: {price}$</p>
                    <p>date {moment(date.eventTime).format('LLL')}</p>
                    <p>date created{moment(date.created).format('LLL')}</p>
                    <p>
                        created by: {Object.keys(managers).map(manager => managers[manager].accountType + ' ' + managers[manager].email)}
                    </p>
                </div>
            </Link>
        </div>
    )
}

EventItem.proptypes = {
    artists: Proptypes.array.isRequired,
    date: Proptypes.string.isRequired,
    venues: Proptypes.array.isRequired,
    name: Proptypes.string.isRequired,
    location: Proptypes.string.isRequired,
    price: Proptypes.number.isRequired,
    id: Proptypes.number.isRequired,
}

export default EventItem