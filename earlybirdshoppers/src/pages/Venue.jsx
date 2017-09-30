import React, { Component } from 'react'
import { events, venues } from '../helpers/mockData'
import NotFound from './NotFound'
import EventItem from '../components/EventItem'
import '../components/VenueItem.css'

class Venue extends Component {

    render() {     
        // TODO if the Venue belongs to the user show edit options
        const { id } = this.props.match.params
        const venue = venues.find(venue => parseInt(id,10) === venue.id)
        
        if(!venue) {
            return <NotFound />
        }

        const {
            events: venueEvents,
            location,
            name,
            openDates,
        } = venue
        const currentEvents = events.filter(event => venueEvents.indexOf(event.id) !== -1)

        console.log('venue', venue)
        return (
            <div className="venue-item page">
                <div className="venue-item-content">
                    <h3>Venue name: {name}</h3>
                    <h4>Based in: {location}</h4>
                    <h4>Open dates: {openDates.join(', ')}</h4>
                    <h4>Events:</h4>
                    <div className="row">
                        {currentEvents.map(event => <EventItem key={`event_item_${event.id}`} {...event} /> )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Venue
