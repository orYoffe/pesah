import React, { Component } from 'react'
import { connect } from 'react-redux'
import BookingAnswerItem from './BookingAnswerItem'

class BookingArtistPanel extends Component {
    render() {
        const { bookingAnswers } = this.props
        const answers = bookingAnswers && Object.keys(bookingAnswers)

        return (
            <div>
                <h3>Booking answers</h3>
                <div>
                    {(!bookingAnswers || !answers.length) ? 
                        <p>You have no booking answers at this time. Try to reach out to artists or publish your event.</p>
                    : answers.map(item => {
                        return (
                            <BookingAnswerItem
                                key={`answer_${bookingAnswers[item].uid}`}
                                {...bookingAnswers[item]}
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
    bookingAnswers: state.auth.user && state.auth.user.bookingAnswers,
})

export default connect(mapStateToProps)(BookingArtistPanel)
