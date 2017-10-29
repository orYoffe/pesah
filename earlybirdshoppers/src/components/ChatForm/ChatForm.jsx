import React, { Component } from 'react'
import { database } from '../../helpers/firebase'

class ChatForm extends Component {
  state = {
    error: null
  }

  submit = (e) => {
    e.preventDefault()
    const { user: { displayName, uid }, roomId } = this.props
    const messages = database().ref(`messages/${roomId}`).push()
    const message = {
      text: this.text.value,
      timeCreated: new Date().toJSON(),
      from: displayName,
      userUid: uid,
      seenBy: { [uid]: { uid, name: displayName, seenAt: new Date().toJSON() } },
      room: roomId,
      uid: messages.key
    }
    window.message = message
    window.database = database
    // const updates = {}
    // updates[messageUid] = message
    // return ref.child(`rooms/${roomId}/messages`).once('value')
    
    debugger
    messages.set(message)
    .then(newMessage => {
      debugger
      // newMessage.update({ uid: newMessage.key })
      this.text.value = ''
      if (this.state.error) {
        this.setState({ error: null })
      }
    }).catch(x => {
      if (x.code === 'PERMISSION_DENIED') {
        this.setState({error: 'An error accurd and your message wasn\'t sent'})
      }
      debugger
    })
  }

  render() {
    const { error } = this.state
    return (
      <form className="form" onSubmit={this.submit}>
        {error && <div className="error">{error}</div>}
        <input className="form-input" placeholder="Write something…" ref={ref => this.text = ref}/>
        <button className="form-button">Send</button>
      </form>
    )
  }
}
export default ChatForm