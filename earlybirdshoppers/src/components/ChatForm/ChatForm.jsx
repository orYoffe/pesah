import React, { Component } from 'react'
import { database } from '../../helpers/firebase'

class ChatForm extends Component {
  state = {
    error: null
  }

  submit = (e) => {
    e && e.preventDefault()
    if (this.text.value.trim().length < 1) {
      return
    }
    const { user: { displayName, userUid }, roomId } = this.props
    const messages = database().ref(`messages/${roomId}`).push()
    const message = {
      text: this.text.value.trim(),
      timeCreated: new Date().toJSON(),
      from: displayName,
      userUid: userUid,
      seenBy: { [userUid]: { uid: userUid, name: displayName, seenAt: new Date().toJSON() } },
      room: roomId,
      uid: messages.key
    }
    
    messages.set(message)
    .then(newMessage => {
      this.text.value = ''
      if (this.state.error) {
        this.setState({ error: null })
      }
    }).catch(x => {
      if (x.code === 'PERMISSION_DENIED') {
        this.setState({error: 'An error accurd and your message wasn\'t sent'})
      }
    })
  }

  render() {
    const { error } = this.state
    return (
      <form className="chat-form" onSubmit={this.submit}>
      <div className="input-group">
        {error && <div className="error">{error}</div>}
        <input className="form-control pull-left" placeholder="Write something…" ref={ref => this.text = ref}/>
        <span className="input-group-btn"><button className="btn btn-primary pull-right">Send</button></span>
        </div>
      </form>
    )
  }
}
export default ChatForm