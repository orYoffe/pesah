import React from 'react'
import moment from 'moment'

const Message = ({ text, from, timeCreated, seenBy, isOtherPeople, isNew, pic }) => (
    <div className={`chat-message ${isOtherPeople ? 'other-person-message' : ''} ${isNew ? 'chat-message-new' : ''}`}>
        <div className="chat-message-title">
            {isNew && <span className="message-new-tag" >**new message** </span>}
            {pic && <img src={pic} alt="artist" className={`pull-${isOtherPeople ? 'right' : 'left'}`} height="50" width="50" />}
            {moment(timeCreated).format('LLL')} {from} said: 
        </div>
        <p>{text}</p>
    </div>
)

export default Message
