import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ref, post } from '../../helpers/firebase'
import { setRoom } from '../../reducers/chat'

class OpenChat extends Component {
    createRoom = (chatPartner) => {
        const { userId, photoURL, displayName } = this.props
        // TODO fix undefined values - can't have undefined when updating the db
        const room = {
            creator: userId,
            messages: {},
            timeCreated: new Date().toJSON(),
            members: {
                [userId]: {
                    uid: userId,
                    photo: photoURL || '',
                    displayName: displayName || ''
                },
                [chatPartner.uid]: {
                    uid: chatPartner.uid,
                    photo: chatPartner.photoURL || '',
                    displayName: chatPartner.displayName || ''
                }
            }
        }
        console.log('new room ========== ', room)
        window.ref = ref
        window.room = room
        // ref.child(`rooms`).push(room)
        // .then(newRoom => {
        //         console.log('newRoom ========== ', newRoom)
        //         //     this.props.setRoom(newRoom.key)
        //         return newRoom.update({ uid: newRoom.key })
        // }).catch(err => {
        //     console.log('newRoom ======err==== ', err)
        //     console.log('newRoom ======err.code==== ', err.code)
        //     console.dir(err)
        // })
        
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
    photoURL: state.auth.user.photoURL,
    displayName: state.auth.user.displayName,
})

export default connect(mapStateToProps, mapDispatchToProps)(OpenChat)
