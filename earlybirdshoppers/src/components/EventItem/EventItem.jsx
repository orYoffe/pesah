import React from 'react'
import moment from 'moment'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
import '../UserItem.css'
import './EventItem.css'

const EventItem = props => {
    const {
            uid,
            title,
            date,
            location,
        venue,
        price,
        managers,
        } = props

    return (
        <div className="col-sm-6 col-xs-12">
            <Link to={`/event/${uid}`} className="event-item  user-item">
                <div className="event-item-content user-item-content">
                    <h4>Event title: {title}</h4>
                    {location && location.address && <p>address: {location.address}</p>}
                    <p> at {venue}</p>
                    {location && <p>city: {location.city}</p>}
                    {location && <p>coutry: {location.coutry}</p>}
                    <p>Price: {price}$</p>
                    {date && <p>date {moment(date.eventTime).format('LLL')}</p>}
                    {date && <p>date created{moment(date.created).format('LLL')}</p>}
                    {managers && <p>
                        created by: {Object.keys(managers).map(manager => managers[manager].accountType + ' ' + managers[manager].email)}
                    </p>}
                </div>
            </Link>
        </div>
    )
}

EventItem.proptypes = {
    artists: Proptypes.array.isRequired,
    date: Proptypes.string.isRequired,
    venues: Proptypes.array.isRequired,
    name: Proptypes.string.isRequired,
    location: Proptypes.string.isRequired,
    price: Proptypes.number.isRequired,
    uid: Proptypes.string.isRequired,
}

export default EventItem