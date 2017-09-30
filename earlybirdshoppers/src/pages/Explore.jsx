import React, { Component } from 'react'
import ExploreCalendar from '../components/ExploreCalendar'
import EventItem from '../components/EventItem'
import ArtistItem from '../components/ArtistItem'
import VenueItem from '../components/VenueItem'
import { events, artists, venues } from '../helpers/mockData'

class Explore extends Component {

    render() {
        return (
            <div className="Explore">
              <h3>Explore Events, Artists and Venues</h3>
              <input type="search" placeholder="Artist/Venue name/location" />
              <button>Search</button>
              <hr/>
            <h4>Trending Events</h4>
              <div className="row">
                {events.map(event => <EventItem key={`event_item_${event.id}`} {...event} />)}
              </div>
                <h4>Trending Artists</h4>
              <div className="row">
                {artists.map(artist => <ArtistItem key={`artist_item_${artist.id}`} {...artist} />)}
              </div>
                <h4>Trending Venues</h4>
              <div className="row">
                {venues.map(venue => <VenueItem key={`venue_item_${venue.id}`} {...venue} />)}
              </div>
              <ExploreCalendar />
            </div>
        )
    }
}

export default Explore
