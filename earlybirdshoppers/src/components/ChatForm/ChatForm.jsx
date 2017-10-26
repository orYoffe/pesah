import React, { Component } from 'react'

class ChatForm extends Component {

  submit = (e) => {
    e.preventDefault()
    const { user: { displayName, photoURL, uid }, messagesRef, roomId } = this.props
    messagesRef.push({
      text: this.text.value,
      timeCreated: Date.now(),
      from: displayName,
      userUid: uid,
      seenBy: { [uid]: { uid, name: displayName, seenAt: Date.now() }},
      room: roomId,
    }).then(newMessage => {
      newMessage.update({ uid: newMessage.key})
    })
    this.text.value = ''
  }

  render() {
    return (
      <form className="form" onSubmit={this.submit}>
        <input className="form-input" placeholder="Write something…" ref={ref => this.text = ref}/>
        <button className="form-button">Send</button>
      </form>
    )
  }
}
export default ChatForm