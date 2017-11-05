import React, { Component } from 'react'
import { connect } from 'react-redux'
import BookingDecisionItem from './BookingDecisionItem'

class BookingVenuePanel extends Component {
    render() {
        const { bookingRequests } = this.props
        const requests = bookingRequests && Object.keys(bookingRequests).filter(item => !(bookingRequests[item].isApproved || bookingRequests[item].isDeclined))

        return (
            <div>
                <h3>Booking Requests</h3>
                <div>
                    {(!bookingRequests || !requests.length) ? 
                        <p>You have no booking requests at this time. Try to reach out to artists or publish your event.</p>
                    : requests.map(item => {
                        return (
                            <BookingDecisionItem
                                key={`decision_${bookingRequests[item].uid}`}
                                {...bookingRequests[item]}
                            />
                        )
                    })}
                    <hr/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    bookingRequests: state.auth.user && state.auth.user.bookingRequests,
})

export default connect(mapStateToProps)(BookingVenuePanel)
