import React, { Component } from 'react'
import moment from 'moment'
import { events, artists, venues } from '../helpers/mockData'
import { getEvent } from '../helpers/firebase'
import NotFound from './NotFound'
import Loader from '../components/Loader/'
import ArtistItem from '../components/ArtistItem/'
import VenueItem from '../components/VenueItem/'
import { pageView } from '../helpers/analytics'

class Event extends Component {
    state = {
        event: null
    }

    componentDidMount() {
        pageView();

        const { id } = this.props.match.params
        let event = events.find(event => parseInt(id,10) === event.id)
        

        if (!event) {
            getEvent(id, snapshot => {
                event = snapshot.val()
                this.setState({ event: event || 'not found' })
            })
            .catch(snapshot => {
                this.setState({ event: 'not found' })
            })
        } else {
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
    }

    raiseTheBar = () => {
        const { event } = this.state
        this.setState({event: {...event, fundsRaised: event.fundsRaised + (event.price || event.ticketPrice)}})
    }

    render() {     
        // TODO if the event belongs to the user show edit options
        // TODO if user doesn't have event, show him onboarding for creating events
        
        const { event } = this.state
        let content
        
        if(event === 'not found') {
            return <NotFound />
        } else if(!event) {
            return <Loader />
        }

        if(event.name) {
            const {
                date,
                location,
                name,
                fundsRaised,
                goal,
                price,
                currentVenue,
                currentArtists
            } = event
            const bar = fundsRaised ? ((fundsRaised/goal) * 100).toFixed(3) : 0
            content = (
                <div className="page-content">
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
            )
        } else {
            const {
                date: {
                    // created,
                    eventTime,
                    },
                goalPrice,
                ticketPrice,
                title,
                verified,
                managers,
                location: {
                    country,
                    city,
                    short,
                    address,
                    // lat,
                    // lng,
                },
                // description,
                fundStatus: {
                    fundsRaised,
                    // precentage,
                },
                page,
                // venueVerified,
                // artistVerified,
                // cancelled,
                // funded,
            } = event   
            const managersArray = Object.keys(managers)
            const bar = fundsRaised ? ((fundsRaised / goalPrice) * 100).toFixed(3) : 0
            content = (
                <div className="page-content">
                    <h3>Event title: {title} {verified ? 'event is verified' : 'event is not verified'}</h3>
                    <h4>Where: {address}</h4>
                    <p>city: {city}, country {country}, short name {short}</p>
                    {page && <img src={page.cover} alt=""/> }
                    <div>
                        <div className="bar-progress"><div style={{ height: `${bar}%` }}>{fundsRaised}$</div></div>
                        <h4>This Event already raised {fundsRaised}$</h4>
                        <h5>Help make this event happen</h5>
                        <p>Ticket price {ticketPrice}$</p>
                        <button className="btn btn-success" onClick={this.raiseTheBar}>Raise The Bar</button>
                    </div>
                    <h5>When: {moment(eventTime).format('LLL')}</h5>
                    <h4>Who:</h4>
                    <div className="row">
                        {managersArray.length && managersArray.map(artist =>
                        <div key={`artist_item_${managers[artist].uid}`}>{managers[artist].email}</div>)}
                    </div>
                </div>
            )
        }
        console.log('event', event)
        return (
            <div className="page">
                {content}
            </div>
        )
    }
}

export default Event
