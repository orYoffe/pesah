import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ref, post } from '../../helpers/firebase'
import { setRoom } from '../../reducers/chat'

class OpenChat extends Component {
    createRoom = (chatPartner) => {
        const { userId, photoURL, displayName } = this.props
        // TODO fix undefined values - can't have undefined when updating the db
        ref.child(`rooms`).push({
            creator: userId,
            messages: {},
            timeCreated: new Date(),
            members: {
                [userId]: {
                    uid: userId,
                    photo: photoURL,
                    displayName
                },
                [chatPartner.uid]: {
                    uid: chatPartner.uid,
                    photo: chatPartner.photoURL,
                    displayName: chatPartner.displayName
                }
            }
        })
        .then(newRoom => newRoom.update({ uid: newRoom.key })
            .then(() => {
                this.props.setRoom(newRoom.key)
            })
        )
        
    }
    
    startChat = () => {
        const { userId, chatPartner } = this.props
        ref.child(`users/${userId}/rooms`).once('value', snapshot => {
            const userRooms = snapshot.val()
            const rooms = userRooms && Object.keys(userRooms)
    
            if (rooms && rooms.length) {
                const room = rooms.find(room => {
                    // check if users have a private room
                    const members = Object.keys(userRooms[room].members)
                    return members.length === 2 && members.includes(userId) && members.includes(chatPartner.uid)
                })
                if (room && userRooms[room] && userRooms[room].uid) {
                    this.props.setRoom(userRooms[room].uid)
                } else {
                    this.createRoom(chatPartner)
                }
            } else {
                this.createRoom(chatPartner)
            }
        })
    }

    render() {
        const { isLoggedIn, userId } = this.props
        if (!isLoggedIn || !userId) {
            return null
        }
        return (
            <button onClick={this.startChat}>Send Message</button>
        )
    }
}

const mapDispatchToProps = dispatch => ({ setRoom: (roomId) => dispatch(setRoom(roomId)) })

const mapStateToProps = state => ({
    isLoggedIn: state.auth.loggedIn,
    userId: state.auth.user.uid,
    photoURL: state.auth.user.photoURL,
    displayName: state.auth.user.displayName,
})

export default connect(mapStateToProps, mapDispatchToProps)(OpenChat)
