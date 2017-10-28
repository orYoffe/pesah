import React, { Component } from 'react'
import { database } from '../../helpers/firebase'

class ChatForm extends Component {

  submit = (e) => {
    e.preventDefault()
    const { user: { displayName, uid }, roomId } = this.props
    // const rooms = snapshot.val();
    // console.log('event==rooms== ', rooms);
    // if (rooms && Object.keys(rooms).length) {
    //   rooms.update(userRoom.uid, userRoom);
    // } else {// if room doesn't exist create the object
    //   const newRooms = {};
    //   newRooms[userRoom.uid] = userRoom;
    //   return admin.database().ref(`/users/${memberId}/rooms`).set(newRooms);
    // }
    const messages = database().ref(`rooms/${roomId}/messages`).push()
    const message = {
      text: this.text.value,
      timeCreated: new Date().toJSON(),
      from: displayName,
      userUid: uid,
      seenBy: { [uid]: { uid, name: displayName, seenAt: new Date().toJSON() } },
      room: roomId,
      uid: messages.key
    }
    // window.message = message
    // window.ref = ref
    // const updates = {}
    // updates[messageUid] = message
    // return ref.child(`rooms/${roomId}/messages`).once('value')
    debugger
    // messages.set(message)
    // .then(snapshot => {
    //   window.room = snapshot.val()
    //   window.snapshot = snapshot
    //   debugger
    // //   const room = snapshot.val()
    // //   if (room.messages) {
    // //     return ref.child(`rooms/${roomId}/messages`).push(message)
    // //   }
    // //   snapshot.set({})

    // // })
    // // .then(newMessage => {
    // //   newMessage.update({ uid: newMessage.key })
    // //   this.text.value = ''
    // }).catch(x => {
    //   debugger
    // })
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