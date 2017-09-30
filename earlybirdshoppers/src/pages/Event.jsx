import React, { Component } from 'react'
import moment from 'moment'
import { events, artists, venues } from '../helpers/mockData'
import NotFound from './NotFound'
import ArtistItem from '../components/ArtistItem'
import VenueItem from '../components/VenueItem'
import '../components/EventItem.css'

class Event extends Component {
    state = {
        event: {
            id: null,
            eventArtists: null,
            date: null,
            location: null,
            name: null,
            fundsRaised: null,
            goal: null,
            eventVenues: null,
            price: null,
            currentVenue: null,
            currentArtists: null,
        }
    }

    componentDidMount() {
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
            fundsRaised = 0,
            goal = 0,
            venues: eventVenues,
            price,
        } = event
        const currentVenue = venues.find(venue => eventVenues[0] === venue.id)
        const currentArtists = artists.filter(artist => eventArtists.indexOf(artist.id) !== -1)

        this.setState({event: {
            id,
            eventArtists,
            date,
            location,
            name,
            fundsRaised,
            goal,
            eventVenues,
            price,
            currentVenue,
            currentArtists
        }})
    }

    raiseTheBar = () => {
        const { event } = this.state
        this.setState({event: {...event, fundsRaised: event.fundsRaised + event.price}})
    }

    render() {     
        // TODO if the event belongs to the user show edit options
        // TODO if user doesn't have event, show him onboarding for creating events
        const {
            id,
            eventArtists,
            date,
            location,
            name,
            fundsRaised,
            goal,
            eventVenues,
            price,
            currentVenue,
            currentArtists
        } = this.state.event
        const bar = fundsRaised ? ((fundsRaised/goal) * 100).toFixed(3) : 0
        console.log('event', this.state.event)
        return (
            <div className="event-item page">
                <div className="event-item-content">
                    <h3>Event name: {name}</h3>
                    <h4>Where: {location}</h4>
                    {currentVenue && <div className="row">
                        <VenueItem {...currentVenue} />
                    </div>}
                    <div>
                        <div className="bar-progress"><div style={{height: `${bar}%`}}>{fundsRaised}$</div></div>
                        <h4>This Event already raised {fundsRaised}$</h4>
                        <h5>Help make this event happen</h5>
                        <p>Ticket price {price}$</p>
                        <button className="btn btn-success" onClick={this.raiseTheBar}>Raise The Bar</button>
                    </div>
                    <h5>When: {moment(date).format('LLL')}</h5>
                    <h4>Who:</h4>
                    <div className="row">
                        {currentArtists && currentArtists.map(artist => <ArtistItem key={`artist_item_${artist.id}`} {...artist} /> )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Event
