import React, { Component } from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
// import '../UserItem.css'
// import './CreateEvent.css'

// currency: {},
//     dates: {
//         created: null,
//         start: null,
//         auctionStart: null,
//         auctionEnd: null,
//         end: null
//     },
//     goalPrice: {},
//     priceStatus: {},
//     ticketPrice: 0,
//     title: '',
//     object: 'event',
//     email: '',
//     eventVerified: false,
//     photoURL: '',
//     uid: 0,
//     artists: {},
//     venues: {},
//     managers: {},
//     isPartOfTour: false,
//     futureEvents: {},
//     pastEvents: {},
//     claimed: false,
//     location: {},
//     collaborationPartners: {
//         venues: {},
//         artists: {}
//     },

class CreateEvent extends Component {
    onSubmit = e => {
        e.preventDefault()
    }

    render() {
        const {
            name,
            location,
            id,
        } = this.props
        return (
            <div className="col-xs-12">
                <form onSubmit={this.onSubmit}>
                    <label htmlFor="eventTitle">Event Title</label>
                    <input type="text" id="eventTitle" placeholder="Event Title" />
                    <label htmlFor="eventDate">Event Date</label>
                    <input type="date" id="eventDate" placeholder="Event Date" />
                </form>
            </div>
        )
    }
}

// CreateEvent.proptypes = {
//     name: Proptypes.string.isRequired,
//     location: Proptypes.string.isRequired,
//     id: Proptypes.number.isRequired,
// }

export default CreateEvent