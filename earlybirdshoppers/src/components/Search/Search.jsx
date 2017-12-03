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
      const events = snapshot.val()
      const keys = Object.keys(events)
      // if (event.title.includes(value) || event.location.city.includes(value)) {
      console.log(events)
      // }
      if (keys.length) {
        this.setState({
          artistsSearch: keys.map(key => events[key]),
        })
      }
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

  renderResults = () => {
    const { artistsSearch, venuesSearch, eventsSearch } = this.state
    if (!artistsSearch.length && !venuesSearch.length && !eventsSearch.length) {
      return null
    }
    return (
      <div>
        <hr />
        <h4>Search results</h4>
        <div className="row">
          {eventsSearch.map(event => <EventItem key={`event_item_${event.uid}`} {...event} />)}
          {artistsSearch.map(artist => <ArtistItem key={`artist_item_${artist.uid}`} {...artist} />)}
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
