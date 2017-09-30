import React from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
import './ArtistItem.css'

const ArtistItem = props => {
    const {
        name,
        location,
        id,
    } = props
    return (
        
        <div className="col-sm-6 col-xs-12">
            <Link to={`/artist/${id}`} className="artist-item item">
                <div className="artist-item-content">
                    <h4>Artist name: {name}</h4>
                    <p>Based in: {location}</p>
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