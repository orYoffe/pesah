import React from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
import '../UserItem.css'
import './ArtistItem.css'

const ArtistItem = props => {

    const {
        name,
        location,
        id,

        uid,
        displayName,
        events,
    } = props
    return (
        <div className="col-sm-6 col-xs-12">
            <Link to={`/artist/${id || uid}`} className="artist-item item user-item">
                <div className="artist-item-content user-item-content">
                    <h4>Artist name: {name || displayName}</h4>
                    {location &&<p>Based in: {location}</p>}
                    {events && Object.keys(events).length && 'has ' + Object.keys(events).length + ' events'}
                </div>
            </Link>
        </div>
    )
}

ArtistItem.proptypes = {
    name: Proptypes.string.isRequired,
    location: Proptypes.string.isRequired,
    id: Proptypes.number.isRequired,
}

export default ArtistItem