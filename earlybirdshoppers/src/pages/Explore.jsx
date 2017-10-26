import React, { Component } from 'react'
// import ExploreCalendar from '../components/ExploreCalendar'
import EventItem from '../components/EventItem/'
import ArtistItem from '../components/ArtistItem/'
import VenueItem from '../components/VenueItem/'
import FanItem from '../components/FanItem/'
import { events, artists, venues, fans } from '../helpers/mockData'
import { pageView } from '../helpers/analytics'
import {
  getArtists,
  getVenues,
  getFans,
  getEvents,
} from '../helpers/firebase'

class Explore extends Component {
  state = {
    artists: [],
    venues: [],
    fans: [],
    events: [],
  }

  componentDidMount() {
        pageView();
        getArtists(artists => {
            this.setState({ artists })
        })
        getFans(fans => {
            this.setState({ fans })
        })
        getVenues(venues => {
            this.setState({ venues })
        })
        getEvents(events => {
          this.setState({ events })
        })
  }

  renderEvents = () => !!this.state.events.length && (
    <div>
      <hr />
      <h4>Real Trending Events</h4>
      <div className="row">
        {this.state.events.map(event => <EventItem key={`event_item_${event.uid}`} {...event} />)}
      </div>
    </div>
  )
  renderArtists = () => !!this.state.artists.length && (
    <div>
      <hr />
      <h4>Real Trending Artists</h4>
      <div className="row">
        {this.state.artists.map(artist => <ArtistItem key={`artist_item_${artist.uid}`} {...artist} />)}
      </div>
    </div>
  )
  renderVenues = () => !!this.state.venues.length && (
    <div>
      <hr />
      <h4>Real Trending Venues</h4>
      <div className="row">
        {this.state.venues.map(venue => <VenueItem key={`venue_item_${venue.uid}`} {...venue} />)}
      </div>
    </div>
  )
  renderFans = () => !!this.state.fans.length && (
    <div>
      <hr />
      <h4>Real Trending Fans</h4>
      <div className="row">
        {this.state.fans.map(fan => <FanItem key={`fan_item_${fan.uid}`} {...fan} />)}
      </div>
    </div>
  )

    render() {
      const realEvents = this.renderEvents()
      const realArtists = this.renderArtists()
      const realVenues = this.renderVenues()
      const realFans = this.renderFans()
        return (
            <div className="Explore container">
              <h3>Explore Events, Artists and Venues</h3>
              <div className="input-group">
                <input className="form-control" type="search" placeholder="Artist/Venue name/location" />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="button">Search</button>
                </span>
              </div>
              {realEvents}
              {realArtists}
              {realVenues}
              {realFans}
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
              {/* <ExploreCalendar /> */}
            </div>
        )
    }
}

export default Explore
