import React, { Component } from 'react'
import ExploreCalendar from '../components/ExploreCalendar'
import EventItem from '../components/EventItem'
import ArtistItem from '../components/ArtistItem'
import VenueItem from '../components/VenueItem'
import FanItem from '../components/FanItem'
import { events, artists, venues, fans } from '../helpers/mockData'

class Explore extends Component {

    render() {
        return (
            <div className="Explore container">
              <h3>Explore Events, Artists and Venues</h3>
              <div className="input-group">
                <input className="form-control" type="search" placeholder="Artist/Venue name/location" />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="button">Search</button>
                </span>
              </div>
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
              <h4>Trending Fans</h4>
              <div className="row">
                {fans.map(fan => <FanItem key={`fan_item_${fan.id}`} {...fan} />)}
              </div>
              <ExploreCalendar />
            </div>
        )
    }
}

export default Explore
