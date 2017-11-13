import React, { Component } from 'react'
import { getVenues } from '../helpers/firebase'
import { pageView } from '../helpers/analytics'
import VenueItem from './VenueItem'
import Map from './Map'

class Venues extends Component {
    state = {
        venues: [],
        markers: [],
    }
    componentDidMount() {
        pageView('venues');
        getVenues(res => {
            if (res && res.length) {
                const markers = res.filter(item => item.locationLng && item.locationLat)
                this.setState({
                    venues: res, markers: markers.map(item => item.locationLng && item.locationLat && ({
                        position: { lng: item.locationLng, lat: item.locationLat },
                        // label: item.name || item.displayname,
                        defaultTitle: item.name || item.displayname,
                        onClick: () => this.props.history.push(`/venue/${item.uid}`)
                    })) })
            }
        })
    }
    render() {
        const { venues, markers } = this.state
        if (!venues.length) {
            return null
        }

        return (
            <div>
                <Map markers={markers} />
                <hr />
                <h4>Real Trending Venues</h4>
                <div className="row">
                    {venues.map(venue => <VenueItem key={`venue_item_${venue.uid}`} {...venue} />)}
                </div>
            </div>
        )
    }
}

export default Venues
