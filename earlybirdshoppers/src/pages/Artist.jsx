import React, { Component } from 'react'
import { events, artists } from '../helpers/mockData'
import NotFound from './NotFound'
import EventItem from '../components/EventItem'
import '../components/ArtistItem.css'

class Artist extends Component {

    render() {     
        // TODO if the artist belongs to the user show edit options
        const { id } = this.props.match.params
        const artist = artists.find(artist => parseInt(id,10) === artist.id)
        
        if(!artist) {
            return <NotFound />
        }

        const {
            events: artistEvents,
            location,
            name,
        } = artist
        const currentEvents = events.filter(event => artistEvents.indexOf(event.id) !== -1)

        console.log('artist', artist)
        return (
            <div className="artist-item">
                <div className="artist-item-content">
                    <h3>Artist name: {name}</h3>
                    <h4>Based in: {location}</h4>
                    <h4>Events:</h4>
                    <div className="row">
                        {currentEvents.map(event => <EventItem key={`event_item_${event.id}`} {...event} /> )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Artist
