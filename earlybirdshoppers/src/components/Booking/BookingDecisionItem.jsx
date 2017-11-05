import React, { Component } from 'react'
import Proptypes from 'prop-types'
import { approveBooking, declineBooking } from '../../helpers/firebase'
import Modal from '../Modal'
import Loader from '../Loader'

const init = 'init'
const approved = 'approved'
const declined = 'declined'
const loading = 'loading'

class BookingDecisionItem extends Component {
    state = {
        status: init,
        isModalOpen: false,
    }
    proptypes = {
        message: Proptypes.string,
        displayName: Proptypes.string.isRequired,
        uid: Proptypes.string.isRequired,
        approveBooking: Proptypes.func.isRequired,
        declineBooking: Proptypes.func.isRequired,
    }

    updateBooking = (uid, status, request) => {
        // TODO add message functionality
        request({ artistId: uid }, res => {
            if (res.message === 'ok') {
                this.setState({ isModalOpen: false, status })
            } else if (res.errorMessage === 'doesn\'t exists') {
                this.setState({ isModalOpen: 'doesNotExists' })
            } else {
                this.setState({ isModalOpen: 'error' })
            }
        }).catch(err => this.setState({ isModalOpen: 'error' }))
        this.setState({ status: 'error' })
    }
    declineBooking = uid => this.updateBooking(uid, declined, declineBooking)
    
    approveBooking = uid => this.updateBooking(uid, approved, approveBooking)
    onModalClose = (e) => this.setState({ isModalOpen: false })
    

    render() {
        const { displayName, message } = this.props
        const { status, isModalOpen } = this.state
        let content
        
        switch(status) {
            case loading:
                content = <Loader />
                break
            case approved:
                content = <div><hr />You approved {displayName}s' booking request</div>
                break
            case declined:
                content = <div><hr />You declined {displayName}s' booking request</div>
                break
            default:
            content = (
                <div>
                    <hr />
                    {displayName} sent you a booking request
                    {message && <div>with this message: {message}</div>}
                    <button onClick={this.approveBooking} className="btn btn-success">Confirm</button>
                    <button onClick={this.declineBooking} className="btn btn-danger">Decline</button>
                </div>
            )
        }

        return (
            <div>
                {content}
                {isModalOpen === 'doesNotExists' && <Modal
                    question={<p>This request appears to be no longer active</p>}
                    onClose={this.onModalClose}
                />}
                {isModalOpen === 'error' && <Modal
                    question={<p>we got an error the data wasn't uploaded to the database</p>}
                    onClose={this.onModalClose}
                />}
            </div>
        )
    }
}

export default BookingDecisionItem