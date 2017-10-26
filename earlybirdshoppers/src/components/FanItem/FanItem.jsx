import React from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
import '../UserItem.css'
import './FanItem.css'

const FanItem = props => {
    const {
        name,
        location,
        id,
        uid,
        displayName,
    } = props
    return (
        
        <div className="col-sm-6 col-xs-12">
            <Link to={`/fan/${id || uid}`} className="fan-item item user-item">
                <div className="fan-item-content user-item-content">
                    <h4>fan name: {name || displayName}</h4>
                    {location && <p>Based in: {location}</p>}
                </div>
            </Link>
        </div>
    )
}

FanItem.proptypes = {
    name: Proptypes.string.isRequired,
    location: Proptypes.string.isRequired,
    id: Proptypes.number.isRequired,
}

export default FanItem