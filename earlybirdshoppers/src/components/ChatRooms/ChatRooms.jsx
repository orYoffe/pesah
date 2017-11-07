import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setRoom } from '../../reducers/chat'
import './ChatRooms.css'

class ChatRooms extends Component {
    state = {
        isOpen: false
    }
        
    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen })
    
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
        let roomsItems
        if (isOpen) {
            roomsItems = roomsKeys.map(roomKey => {
                const members = Object.keys(rooms[roomKey].members)
                const membersNames = members.filter(member => rooms[roomKey].members[member].uid !== userUid)
                    .map(member =>
                        rooms[roomKey].members[member].uid !== userUid ? rooms[roomKey].members[member].displayName : null
                    ).join(', ')
                return (
                    <button
                        className="btn btn-default form-control"
                        key={`${roomKey}_room_item`}
                        onClick={() => setRoom(roomKey)}
                    >
                        {membersNames}
                    </button>
                
                )
            })
        }
        return (
        <span>
            <button className={`btn btn-${isOpen ? 'primary' : 'default'} rooms-button`} onClick={this.toggleOpen}>
                <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
            </button>
            {isOpen && <div className="chat-rooms">
                <button onClick={this.toggleOpen} className="btn btn-danger pull-right">X</button>
                <h5 className="rooms-title">RTB messages</h5>
                <div className="chat-room-display" ref={ref => this.messagesView = ref}>
                    {roomsItems}
                </div>
            </div>}
            </span>
        )
    }
}

const mapDispatchToProps = dispatch => ({ setRoom: (roomId) => dispatch(setRoom(roomId)) })

const mapStateToProps = state => ({
    rooms: state.auth.user && state.auth.user.rooms,
    userUid: state.auth.user && state.auth.user.uid,
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatRooms)
