import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import { pageView } from '../helpers/analytics'
import { getExplore, database, sendMeEmail } from '../helpers/firebase'
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
    artistsSearch: [],
    venuesSearch: [],
    fansSearch: [],
    eventsSearch: [],
    loading: true,
  }

  componentDidMount() {
      pageView('explore')
      this.keyDownSearch = debounce(() => this.search(), 500)
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
      <h4>Trending Events</h4>
      <div className="row">
        {this.state.events.map(event => <EventItem key={`event_item_${event.uid}`} {...event} />)}
      </div>
    </div>
  )
  renderArtists = () => !!this.state.artists.length && (
    <div>
      <hr />
      <h4>Trending Artists</h4>
      <div className="row">
        {this.state.artists.map(artist => <ArtistItem key={`artist_item_${artist.uid}`} {...artist} />)}
      </div>
    </div>
  )
  renderVenues = () => !!this.state.venues.length && (
    <div>
      <hr />
      <h4>Trending Venues</h4>
      <div className="row">
        {this.state.venues.map(venue => <VenueItem key={`venue_item_${venue.uid}`} {...venue} />)}
      </div>
    </div>
  )
  renderFans = () => !!this.state.fans.length && (
    <div>
      <hr />
      <h4>Trending Fans</h4>
      <div className="row">
        {this.state.fans.map(fan => <FanItem key={`fan_item_${fan.uid}`} {...fan} />)}
      </div>
    </div>
  )
  renderResults = () => {
    const { artistsSearch, venuesSearch, fansSearch } = this.state
    if (!artistsSearch.length && !venuesSearch.length && !fansSearch.length) {
      return null
    }
    return (
    <div>
      <hr />
      <h4>Search results</h4>
      <div className="row">
        {artistsSearch.map(artist => <ArtistItem key={`artist_item_${artist.uid}`} {...artist} />)}
        {venuesSearch.map(venue => <VenueItem key={`venue_item_${venue.uid}`} {...venue} />)}
        {fansSearch.map(fan => <FanItem key={`fan_item_${fan.uid}`} {...fan} />)}
      </div>
    </div>
  )
}

  search = (e) => {
    if (e) {
      e.preventDefault()
    }
    let value = this.searchInput.value.trim()
    if (!value.length) {
      return
    }
    value = value.toLowerCase()
    this.setState({
      artistsSearch: [],
      venuesSearch: [],
      fansSearch: [],
      eventsSearch: [],
    })
    const regex = new RegExp( value, 'gi' )
    database().ref('events/')//.orderBy('title')//.equalTo(value)
    .once('value', (snapshot) => {
        const event = snapshot.val()
        // if (event.title.includes(value) || event.location.city.includes(value)) {
            console.log(event)
        // }
    })
    database().ref('artists/')//.orderBy('title')//.equalTo(value)
    .once('value', (snapshot) => {
        const artists = snapshot.val()
        const keys = Object.keys(artists)
        const results = []
        keys.forEach(key => {
          if (artists[key].displayName && artists[key].displayName.match(regex)) {
              console.log(artists[key])
              results.push(artists[key])
          }
        })
        if (results.length) {
          this.setState({
            artistsSearch: results,
          })
        }
    })
    database().ref('fans/')//.orderBy('title')//.equalTo(value)
    .once('value', (snapshot) => {
      const artists = snapshot.val()
      const keys = Object.keys(artists)
      const results = []
      keys.forEach(key => {
        if (artists[key].displayName && artists[key].displayName.match(regex)) {
            console.log(artists[key])
            results.push(artists[key])
        }
      })
      if (results.length) {
        this.setState({
          fansSearch: results,
        })
      }
    })
    database().ref('venues/')//.orderBy('title')//.equalTo(value)
    .once('value', (snapshot) => {
      const artists = snapshot.val()
      const keys = Object.keys(artists)
      const results = []
      keys.forEach(key => {
        if (
          (artists[key].displayName && artists[key].displayName.match(regex))
        || (artists[key].name && artists[key].name.match(regex))
        || (artists[key].locationAddress && artists[key].locationAddress.match(regex))
        || (artists[key].locationName && artists[key].locationName.match(regex))
      ) {
            console.log(artists[key])
            results.push(artists[key])
        }
      })
      if (results.length) {
        this.setState({
          venuesSearch: results,
        })
      }
    })
  }



  render() {
      return (
          <div className="Explore container">
            <button onClick={() => {
                sendMeEmail()
              }}>send me an mail</button>
            <h3>Explore Events, Artists and Venues</h3>
            <form className="input-group" onKeyDown={this.keyDownSearch} onSubmit={this.search}>
              <input className="form-control" ref={ref => this.searchInput = ref} type="search" placeholder="Artist/Venue name/location" />
              <span className="input-group-btn">
                <button className="btn btn-default" type="submit">Search</button>
              </span>
            </form>
            {this.state.loading && <Loader />}
            {this.renderResults()}
            {this.renderEvents()}
            {this.renderArtists()}
            {this.renderVenues()}
            {this.renderFans()}
          </div>
      )
  }
}

export default Explore
