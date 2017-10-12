import React, { Component } from 'react'
import { events, fans } from '../helpers/mockData'
import { getUser } from '../helpers/firebase'
import NotFound from './NotFound'
import EventItem from '../components/EventItem/'
import Loader from '../components/Loader/'
import { pageView } from '../helpers/analytics'
import '../components/FanItem/FanItem.css'

class Fan extends Component {
    state = {
        fan: null
    }

    componentDidMount() {
        pageView();

        const { id } = this.props.match.params
        let fan = fans.find(fan => parseInt(id,10) === fan.id)

        if (!fan) {
            getUser(id, snapshot => {
                fan = snapshot.val()
                this.setState({ fan: fan || 'not found' })
            })
            .catch(snapshot => {
                this.setState({ fan: 'not found' })
            })
        } else {
            this.setState({ fan })
        }
    }

    render() {     
        // TODO if the fan belongs to the user show edit options
        const { fan } = this.state
        let content
        
        if(fan === 'not found') {
            return <NotFound />
        } else if(!fan) {
            return <Loader />
        }
        if(fan.location) {
            // fake data
            const {
                events: fanEvents,
                location,
                name,
            } = fan
            const currentEvents = events.filter(event => fanEvents.indexOf(event.id) !== -1)

            content = (
                        <div className="page-content">
                            <h3>Fan name: {name}</h3>
                            <h4>Based in: {location}</h4>
                            <h4>Events:</h4>
                            <div className="row">
                                {currentEvents && currentEvents.map(event => <EventItem key={`event_item_${event.id}`} {...event} /> )}
                            </div>
                        </div>
                    )
        } else {
            const { email } = fan
            content = (<div className="page-content">
                            <h5> email: {email} </h5>
                        </div>)
        }

        console.log('fan', fan)
        return (
            <div className="page">
                {content}
            </div>
        )
    }
}

export default Fan
