import React from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
import './VenueItem.css'

const VenueItem = props => {
    const {
        name,
        location,
        id,
    } = props
    return (
        <Link to={`/venue/${id}`} className="col-sm-6 col-xs-12 venue-item">
            <div className="venue-item-content">
                <h4>Venue name: {name}</h4>
                <p>location: {location}</p>
            </div>
        </Link>
    )
}

VenueItem.proptypes = {
    name: Proptypes.string.isRequired,
    location: Proptypes.string.isRequired,
    id: Proptypes.number.isRequired,
}

export default VenueItem