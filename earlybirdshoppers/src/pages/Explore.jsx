import React, { Component } from 'react'
import { pageView } from '../helpers/analytics'
import { getExplore } from '../helpers/firebase'
import EventItem from '../components/EventItem'
import ArtistItem from '../components/ArtistItem'
import VenueItem from '../components/VenueItem'
import FanItem from '../components/FanItem'
import Loader from '../components/Loader'

class Explore extends Component {
  state = {
    artists: [],
    venues: [],
    fans: [],
    events: [],
    loading: true,
  }

  componentDidMount() {
      pageView('explore');
      getExplore(res => {
        if (res && (res.artists || res.events || res.fans || res.venues)){
          const { artists, events, venues, fans } = res
          this.setState({ artists, events, venues, fans, loading: false })
        }
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
      return (
          <div className="Explore container">
            <h3>Explore Events, Artists and Venues</h3>
            <div className="input-group">
              <input className="form-control" type="search" placeholder="Artist/Venue name/location" />
              <span className="input-group-btn">
                <button className="btn btn-default" type="button">Search</button>
              </span>
            </div>
            {this.state.loading && <Loader />}
            {this.renderEvents()}
            {this.renderArtists()}
            {this.renderVenues()}
            {this.renderFans()}
          </div>
      )
  }
}

export default Explore
