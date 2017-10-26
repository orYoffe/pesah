import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ref } from '../../helpers/firebase'
import ChatForm from '../ChatForm/'
import Message from '../Message/'
import { setRoom } from '../../reducers/chat'

class Chat extends Component {
    messagesRef = ''
    state = {
        messages: [],
    }
    componentDidMount() {
        const { roomId, isLoggedIn, uid, displayName } = this.props

        if (!roomId || !isLoggedIn) {
            return
        }
        this.messagesRef = ref.child(`rooms/${roomId}/messages`)
        this.messagesRef.limitToLast(10).on("child_added", function (snapshot) {
            const message = snapshot.val()
            // mark as seenBy
            message.child('seenBy').once('value', seenBy => {
                if (!Object.keys(seenBy).includes(uid)) {
                    seenBy.update(uid, { uid, name: displayName, seenAt: Date.now() })
                }
            })

            this.setState({messages: this.state.messages.push(message)})
        });
    }

    closeChat = () => this.props.setRoom(null)

    render() {
        const { roomId, isLoggedIn, uid, photoURL, displayName } = this.props

        if (!roomId || !isLoggedIn) {
            return null
        }
        const { messages } = this.state
        return (
            <div>
                <h3>Chat</h3>
                <button onClick={this.closeChat}>Close Chat</button>
                <div>
                    {
                        messages.length ? (
                            messages.map(message => <Message {...{
                                text: message.text,
                                from: message.from,
                                timeCreated: message.timeCreated,
                                seenBy: message.seenBy
                            }} key={message.uid} />)
                        ) : 'No messages yet.. maybe write them something :)'
                    }
                </div>
                <ChatForm messagesRef={this.messagesRef} roomId={roomId} user={{displayName, photoURL, uid}}/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    roomId: state.chat.currentRoomId,
    isLoggedIn: state.auth.loggedIn,
    uid: state.auth.user.uid,
    photoURL: state.auth.user.photoURL,
    displayName: state.auth.user.displayName,
})
const mapDispatchToProps = dispatch => ({ setRoom: (roomId) => dispatch(setRoom(roomId)) })

export default connect(mapStateToProps, mapDispatchToProps)(Chat)