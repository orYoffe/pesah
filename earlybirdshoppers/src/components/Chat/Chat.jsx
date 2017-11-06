import React, { Component } from 'react'
import store from 'store'
import { connect } from 'react-redux'
import { ref } from '../../helpers/firebase'
import ChatForm from '../ChatForm/'
import Message from '../Message/'
import { setRoom } from '../../reducers/chat'
import './Chat.css'

const LOCALSTORAGE_CHAT_KEY = 'chat_properties'

class Chat extends Component {
    messagesRef = ''
    state = {
        messages: [],
    }
    
    componentDidMount() {
        const chatProperties = store.get(LOCALSTORAGE_CHAT_KEY)
        if (chatProperties && chatProperties.isOpen && chatProperties.roomId && this.props.rooms[chatProperties.roomId]) {
            this.props.setRoom(chatProperties.roomId)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.roomId !== prevProps.roomId) {
            this.revokeMessagesListener(prevProps.roomId)
            this.getMessages()
        }
    }
    componentWillUnmount() {
        this.revokeMessagesListener(this.props.roomId)
    }
    
    
    
    revokeMessagesListener = (roomId) => ref.child(`messages/${roomId}`).off('child_added')

    getMessages = () => {
        const { roomId, userUid, displayName, isLoggedIn } = this.props

        if (!roomId || !isLoggedIn) {
            return
        }
        store.set(LOCALSTORAGE_CHAT_KEY, { isOpen: true, roomId})
        const messages = []
        ref.child(`messages/${roomId}`).orderByChild('timeCreated')
            .limitToLast(10).on('child_added', (snapshot) => {
                const message = snapshot.val()
                // TODO make a better query for all the unseen messages
                // mark as seenBy
                message.isOtherPeople = message.userUid !== userUid
                if (message.seenBy && message.isOtherPeople) {
                    const seenBy = message.seenBy && Object.keys(message.seenBy)
                    if (!seenBy.includes(userUid)) {
                        message.isNew = true
                        const seenByUser = { userUid, name: displayName, seenAt: new Date().toJSON() }
                        message.seenBy[userUid] = seenByUser
                        ref.child(`messages/${roomId}/${message.uid}/seenBy/${userUid}`).set(seenByUser)
                    }
                }
                messages.push(message)
                this.setState({ messages })
                if (this.messagesView){// && this.messagesView.scrollHeight < this.messagesView.scrollTop) {
                    setTimeout(() => this.messagesView.scroll(0, this.messagesView.scrollHeight), 200)
                }
            })
    }

    closeChat = () => {
        store.set(LOCALSTORAGE_CHAT_KEY, { isOpen: false })
        this.props.setRoom(null)
    }

    render() {
        const { roomId, isLoggedIn, userUid, photoURL, displayName, rooms } = this.props

        if (!roomId || !isLoggedIn || !rooms) {
            return null
        }
        const { messages } = this.state
        
        return (
            <div className="chat-box">
                <button onClick={this.closeChat} className="btn btn-danger pull-right">X</button>
                <h5 className="chat-box-title">RTB Chat with {Object.keys(rooms[roomId].members)
                    .map(member =>
                        rooms[roomId].members[member].uid !== userUid ? rooms[roomId].members[member].displayName : null
                ).join(', ')}</h5>
                <div className="chat-messages" ref={ref => this.messagesView = ref}>
                    {
                        messages.length ? (
                            messages.map(message => {
                                return (
                                    <Message {...{
                                        isNew: message.isNew,
                                        isOtherPeople: message.isOtherPeople,
                                        text: message.text,
                                        from: message.from,
                                        timeCreated: message.timeCreated,
                                        seenBy: message.seenBy
                                    }} key={message.uid} />
                                )
                            })
                        ) : 'No messages yet.. maybe write them something :)'
                    }
                </div>
                <ChatForm roomId={roomId} user={{ displayName, photoURL, userUid}}/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    roomId: state.chat.currentRoomId,
    isLoggedIn: state.auth.loggedIn,
    userUid: state.auth.user && state.auth.user.uid,
    photoURL: state.auth.user && state.auth.user.photoURL,
    displayName: state.auth.user && state.auth.user.displayName,
    rooms: state.auth.user && state.auth.user.rooms,
})
const mapDispatchToProps = dispatch => ({ setRoom: (roomId) => dispatch(setRoom(roomId)) })

export default connect(mapStateToProps, mapDispatchToProps)(Chat)