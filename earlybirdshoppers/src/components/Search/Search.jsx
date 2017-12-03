import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import { database } from '../../helpers/firebase'
import EventItem from '../EventItem'
import ArtistItem from '../ArtistItem'
import VenueItem from '../VenueItem'
// import FanItem from '../FanItem'
import './Search.css'

class Search extends Component {
  state = {
    artistsSearch: [],
    musiciansSearch: [],
    venuesSearch: [],
    // fansSearch: [],
    eventsSearch: [],
  }

  componentDidMount() {
    this.keyDownSearch = debounce(() => this.search(), 500)
  }

  search = (e) => {
    if (e) {
      e.preventDefault()
    }
    let value = this.searchInput.value.trim()
    const { artistsSearch, venuesSearch, eventsSearch, musiciansSearch } = this.state
    if (!value.length) {
      if (artistsSearch.length || venuesSearch.length || eventsSearch.length || musiciansSearch.length) {
        this.setState({
          musiciansSearch: [],
          artistsSearch: [],
          venuesSearch: [],
          // fansSearch: [],
          eventsSearch: [],
        })
      }
      return
    }
    value = value.toLowerCase()
    this.setState({
      musiciansSearch: [],
      artistsSearch: [],
      venuesSearch: [],
      // fansSearch: [],
      eventsSearch: [],
    })
    const regex = new RegExp( value, 'gi' )
    database().ref('events/')//.orderBy('title')//.equalTo(value)
    .once('value', (snapshot) => {
      const events = snapshot.val()
      if (!events) {
        return
      }
      const keys = Object.keys(events)
      // if (event.title.includes(value) || event.location.city.includes(value)) {
      console.log(events)
      // }
      if (keys.length) {
        this.setState({
          eventsSearch: keys.map(key => events[key]),
        })
      }
    })
    database().ref('artists/')//.orderBy('title')//.equalTo(value)
    .once('value', (snapshot) => {
      const artists = snapshot.val()
      if (!artists) {
        return
      }
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
    database().ref('musicians/')//.orderBy('title')//.equalTo(value)
    .once('value', (snapshot) => {
      const musicians = snapshot.val()
      if (!musicians) {
        return
      }
      const keys = Object.keys(musicians)
      const results = []
      keys.forEach(key => {
        if (musicians[key].displayName && musicians[key].displayName.match(regex)) {
          console.log(musicians[key])
          results.push(musicians[key])
        }
      })
      if (results.length) {
        this.setState({
          musiciansSearch: results,
        })
      }
    })
    // database().ref('fans/')//.orderBy('title')//.equalTo(value)
    // .once('value', (snapshot) => {
    //   const artists = snapshot.val()
    //   const keys = Object.keys(artists)
    //   const results = []
    //   keys.forEach(key => {
    //     if (artists[key].displayName && artists[key].displayName.match(regex)) {
    //       console.log(artists[key])
    //       results.push(artists[key])
    //     }
    //   })
    //   if (results.length) {
    //     this.setState({
    //       fansSearch: results,
    //     })
    //   }
    // })
    database().ref('venues/')//.orderBy('title')//.equalTo(value)
    .once('value', (snapshot) => {
      const venues = snapshot.val()
      if (!venues) {
        return
      }
      const keys = Object.keys(venues)
      const results = []
      keys.forEach(key => {
        if (
          (venues[key].displayName && venues[key].displayName.match(regex))
          || (venues[key].name && venues[key].name.match(regex))
          || (venues[key].locationAddress && venues[key].locationAddress.match(regex))
          || (venues[key].locationName && venues[key].locationName.match(regex))
        ) {
          console.log(venues[key])
          results.push(venues[key])
        }
      })
      if (results.length) {
        this.setState({
          venuesSearch: results,
        })
      }
    })
  }

  renderResults = () => {
    const { artistsSearch, venuesSearch, eventsSearch, musiciansSearch } = this.state
    if (!artistsSearch.length && !venuesSearch.length && !eventsSearch.length && !musiciansSearch.length) {
      if (this.searchInput && this.searchInput.value.trim()) {
        return <div>No results found</div>
      }
      return null
    }
    return (
      <div>
        <hr />
        <h4>Search results</h4>
        <div className="row">
          {eventsSearch.map(event => <EventItem key={`event_item_${event.uid}`} {...event} />)}
          {artistsSearch.map(artist => <ArtistItem key={`artist_item_${artist.uid}`} {...artist} />)}
          {musiciansSearch.map(artist => <ArtistItem key={`artist_item_${artist.uid}`} {...artist} />)}
          {venuesSearch.map(venue => <VenueItem key={`venue_item_${venue.uid}`} {...venue} />)}
        </div>
      </div>
    )
  }
  render() {
    return (
      <div>
        <form className="input-group" onKeyDown={this.keyDownSearch} onSubmit={this.search}>
          <input className="form-control" ref={ref => this.searchInput = ref} type="search" placeholder="Artist/Venue name/location" />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">Search</button>
          </span>
        </form>
        {this.renderResults()}
      </div>
    )
  }
}


export default Search
