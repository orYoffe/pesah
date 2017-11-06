import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ref, getRoom } from '../../helpers/firebase'
import { setRoom } from '../../reducers/chat'

class OpenChat extends Component {
    createRoom = (chatPartner) => {
        getRoom({
            uid: chatPartner.uid,
            photo: chatPartner.photo || '',
            displayName: chatPartner.displayName || ''
        })
        .then(res => {
            this.props.setRoom(res.roomId)
        }).catch(err => {
            console.dir(err)
        })
    }
    
    startChat = () => this.createRoom(this.props.chatPartner)

    render() {
        const { isLoggedIn, userId, chatPartner } = this.props
        if (!isLoggedIn || !userId) {
            return null
        }
        return (
            <button className="btn btn-primary" onClick={this.startChat}>Send {chatPartner.displayName} a Message</button>
        )
    }
}

const mapDispatchToProps = dispatch => ({ setRoom: (roomId) => dispatch(setRoom(roomId)) })

const mapStateToProps = state => ({
    isLoggedIn: state.auth.loggedIn,
    userId: state.auth.user.uid,
})

export default connect(mapStateToProps, mapDispatchToProps)(OpenChat)
