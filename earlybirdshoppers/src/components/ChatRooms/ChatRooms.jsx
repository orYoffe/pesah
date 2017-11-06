import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setRoom } from '../../reducers/chat'
import './ChatRooms.css'

class ChatRooms extends Component {
    state = {
        isOpen: false
    }
        
    open = () => this.setState({ isOpen: true })
    close = () => this.setState({ isOpen: false })
    
    render() {
        const { rooms, setRoom, userUid } = this.props
        const { isOpen } = this.state
        if (!rooms) {
            return null
        }
        const roomsKeys = Object.keys(rooms)
        if (!roomsKeys.length) {
            return null
        }
        if (!isOpen) {
            return (
                <button className="btn btn-primary" onClick={this.open}>
                    <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                </button>
            )
        }
        const roomsItems = roomsKeys.map(roomKey => (
            <button
                className="btn btn-default form-control"
                key={`${roomKey}_room_item`}
                onClick={() => setRoom(roomKey)}
            >
                {Object.keys(rooms[roomKey].members)
                    .map(member =>
                        rooms[roomKey].members[member].uid !== userUid ? rooms[roomKey].members[member].displayName : null
                ).join(', ')}
            </button>
        ))
        return (
            <div className="chat-rooms">
                <button onClick={this.close} className="btn btn-danger pull-right">X</button>
                <h5 className="pull-left">RTB messages</h5>
                <div className="chat-room-display" ref={ref => this.messagesView = ref}>
                    {roomsItems}
                        
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({ setRoom: (roomId) => dispatch(setRoom(roomId)) })

const mapStateToProps = state => ({
    rooms: state.auth.user && state.auth.user.rooms,
    userUid: state.auth.user && state.auth.user.uid,
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatRooms)
