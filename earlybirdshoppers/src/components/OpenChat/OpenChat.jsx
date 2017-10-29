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
            console.log('newRoom ========== ', res)
            this.props.setRoom(res.roomId)
        }).catch(err => {
            console.log('newRoom ======err==== ', err)
            console.log('newRoom ======err.code==== ', err.code)
            console.dir(err)
        })
    }
    
    startChat = () => {
        const { userId, chatPartner } = this.props
        // ref.child(`users/${userId}/rooms`).once('value', snapshot => {
        //     const userRooms = snapshot.val()
        //     const rooms = userRooms && Object.keys(userRooms)
    
        //     if (rooms && rooms.length) {
        //         const room = rooms.find(room => {
        //             // check if users have a private room
        //             const members = Object.keys(userRooms[room].members)
        //             return members.length === 2 && members.includes(userId) && members.includes(chatPartner.uid)
        //         })
        //         if (room && userRooms[room] && userRooms[room].uid) {
        //             this.props.setRoom(userRooms[room].uid)
        //         } else {
        //             this.createRoom(chatPartner)
        //         }
        //     } else {
                this.createRoom(chatPartner)
        //     }
        // })
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
})

export default connect(mapStateToProps, mapDispatchToProps)(OpenChat)
