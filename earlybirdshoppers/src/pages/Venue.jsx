import React, { Component } from 'react'
import { events, venues } from '../helpers/mockData'
import NotFound from './NotFound'
import EventItem from '../components/EventItem'
import Loader from '../components/Loader'
import { getUser } from '../helpers/firebase'
import { pageView } from '../helpers/analytics'
import '../components/VenueItem.css'

class Venue extends Component {
    state = {
        venue: null
    }

    componentDidMount() {
        pageView();

        const { id } = this.props.match.params
        let venue = venues.find(venue => parseInt(id,10) === venue.id)

        if (!venue) {
            getUser(id, snapshot => {
                venue = snapshot.val()
                this.setState({ venue: venue || 'not found' })
            })
            .catch(snapshot => {
                this.setState({ venue: 'not found' })
            })
        } else {
            this.setState({ venue })
        }
    }

    render() {     
        // TODO if the Venue belongs to the user show edit options
        const {venue} = this.state
        let content
        
        if(venue === 'not found') {
            return <NotFound />
        } else if(!venue) {
            return <Loader />
        }

        if(venue.location) {
            const {
                events: venueEvents,
                location,
                name,
                openDates,
            } = venue
            const currentEvents = events.filter(event => venueEvents.indexOf(event.id) !== -1)

            content = (
                <div className="page-content">
                    <h3>Venue name: {name}</h3>
                    <h4>Based in: {location}</h4>
                    <h4>Open dates: {openDates.join(', ')}</h4>
                    <h4>Events:</h4>
                    <div className="row">
                        {currentEvents.map(event => <EventItem key={`event_item_${event.id}`} {...event} /> )}
                    </div>
                </div>
            )
        } else {
            const { email } = venue
            content = (<div className="page-content">
                            <h5> email: {email} </h5>
                        </div>)
        }


        console.log('venue', venue)
        return (
            <div className="page">
                {content}
            </div>
        )
    }
}

export default Venue
