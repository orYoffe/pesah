import React, { Component } from 'react'
import moment from 'moment'
import { getEvent } from '../helpers/firebase'
import NotFound from './NotFound'
import Loader from '../components/Loader/'
// import ArtistItem from '../components/ArtistItem/'
// import VenueItem from '../components/VenueItem/'
import { pageView } from '../helpers/analytics'

class Event extends Component {
    state = {
        event: null
    }

    componentDidMount() {
        pageView();

        const { id } = this.props.match.params

        getEvent(id, snapshot => {
            const event = snapshot && snapshot.val()
            this.setState({ event: event || 'not found' })
        })
        .catch(snapshot => {
            this.setState({ event: 'not found' })
        })
    }

    raiseTheBar = () => {
        const { event } = this.state
        this.setState({event: {...event, fundsRaised: event.fundsRaised + (event.price || event.ticketPrice)}})
    }

    render() {     
        // TODO if the event belongs to the user show edit options
        // TODO if user doesn't have event, show him onboarding for creating events
        
        const { event } = this.state
        
        if(event === 'not found') {
            return <NotFound />
        } else if(!event) {
            return <Loader />
        }
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
        const content = (
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
        
        console.log('event', event)
        return (
            <div className="page">
                {content}
            </div>
        )
    }
}

export default Event
