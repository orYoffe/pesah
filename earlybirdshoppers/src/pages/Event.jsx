import React, { Component } from 'react'
import moment from 'moment'
import { events, artists, venues } from '../helpers/mockData'
import NotFound from './NotFound'
import ArtistItem from '../components/ArtistItem'
import VenueItem from '../components/VenueItem'
import '../components/EventItem.css'

class Event extends Component {

    render() {     
        // TODO if the event belongs to the user show edit options
        // TODO if user doesn't have event, show him onboarding for creating events
        const { id } = this.props.match.params
        const event = events.find(event => parseInt(id,10) === event.id)
        
        if(!event) {
            return <NotFound />
        }

        const {
            artists: eventArtists,
            date,
            location,
            name,
            venues: eventVenues,
            price,
        } = event
        const currentVenue = venues.find(venue => eventVenues[0] === venue.id)
        const currentArtists = artists.filter(artist => eventArtists.indexOf(artist.id) !== -1)

        console.log('event', event)
        return (
            <div className="event-item page">
                <div className="event-item-content">
                    <h3>Event name: {name}</h3>
                    <h4>Where: {location}</h4>
                    {currentVenue && <div className="row">
                        <VenueItem {...currentVenue} />
                    </div>}
                    <h5>How much: {price}$</h5>
                    <h5>When: {moment(date).format('LLL')}</h5>
                    <h4>Who:</h4>
                    <div className="row">
                        {currentArtists.map(artist => <ArtistItem key={`artist_item_${artist.id}`} {...artist} /> )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Event
