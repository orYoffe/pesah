import React, { Component } from 'react'
import { connect } from 'react-redux'
import { pageView } from '../helpers/analytics'
import { getExplore, sendMeEmail } from '../helpers/firebase'
import EventItem from '../components/EventItem'
import ArtistItem from '../components/ArtistItem'
import MusicianItem from '../components/MusicianItem'
import VenueItem from '../components/VenueItem'
// import FanItem from '../components/FanItem'
import Loader from '../components/Loader'
import Search from '../components/Search'

class Explore extends Component {
  state = {
    artists: [],
    venues: [],
    musicians: [],
    // fans: [],
    events: [],
    loading: true,
  }

  componentDidMount() {
    pageView('explore')
    getExplore(res => {
      if (res && (res.artists || res.events || res.venues || res.musicians)){
        const { artists, events, venues, musicians } = res
        this.setState({ artists, events, venues, musicians, loading: false })
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
  renderMusicians = () => !!this.state.musicians.length && (
    <div>
      <hr />
      <h4>Trending Musicians</h4>
      <div className="row">
        {this.state.musicians.map(musician => <MusicianItem key={`musician_item_${musician.uid}`} {...musician} />)}
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
  // renderFans = () => !!this.state.fans.length && (
  //   <div>
  //     <hr />
  //     <h4>Trending Fans</h4>
  //     <div className="row">
  //       {this.state.fans.map(fan => <FanItem key={`fan_item_${fan.uid}`} {...fan} />)}
  //     </div>
  //   </div>
  // )



  render() {
    return (
      <div className="Explore container">
        {this.props.isLoggedIn && <button onClick={() => {
          sendMeEmail()
        }}>send me an mail</button>}
        <h3>Explore Events, Artists and Venues</h3>
        <Search />
        {this.state.loading && <Loader />}
        {this.renderEvents()}
        {this.renderArtists()}
        {this.renderMusicians()}
        {this.renderVenues()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.loggedIn,
})

export default connect(mapStateToProps)(Explore)
