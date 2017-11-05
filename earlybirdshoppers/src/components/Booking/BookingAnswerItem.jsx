import React, { Component } from 'react'
import Proptypes from 'prop-types'
import { approveBooking, declineBooking } from '../../helpers/firebase'
import Loader from '../Loader'

const init = 'init'
const approved = 'approved'
const declined = 'declined'
const loading = 'loading'

class BookingAnswerItem extends Component {
    state = {
        status: init,
    }
    proptypes = {
        message: Proptypes.string,
        displayName: Proptypes.string.isRequired,
        uid: Proptypes.string.isRequired,
    }

    componentDidMount() {
        const { isApproved, isDeclined } = this.props
        if (isApproved && !isDeclined) {
            this.setState({ status: approved })
        } else if (!isApproved && isDeclined) {
            this.setState({ status: declined })
        }
    }
    

    render() {
        const { displayName, message } = this.props
        const { status } = this.state
        let content
        
        switch(status) {
            case loading:
                content = <Loader />
                break
            case approved:
                content = <div><hr />{displayName} approved your booking request</div>
                break
            case declined:
                content = <div><hr />{displayName} declined your booking request</div>
                break
            default:
            content = (
                <div>
                    <hr />
                    You've sent a booking request to {displayName}
                    {message && <div>with this message: {message}</div>}
                </div>
            )
        }

        return (
            <div>
                {content}
            </div>
        )
    }
}

export default BookingAnswerItem