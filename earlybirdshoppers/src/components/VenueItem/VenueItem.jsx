import React from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
import '../UserItem.css'
import './VenueItem.css'

const VenueItem = props => {
    const {
        name,
        uid, 
        locationAddress,
    } = props
    return (
        <div className="col-sm-6 col-xs-12">
            <Link to={`/venue/${uid}`} className="venue-item user-item">
                <div className="venue-item-content user-item-content">
                    <h4>Venue name: {name}</h4>
                    <p>Address: {locationAddress}</p>
                </div>
            </Link>
        </div>
    )
}

VenueItem.proptypes = {
    name: Proptypes.string.isRequired,
    location: Proptypes.string.isRequired,
    uid: Proptypes.string.isRequired,
}

export default VenueItem