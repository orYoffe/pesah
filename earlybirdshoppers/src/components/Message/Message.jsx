import React from 'react'
import moment from 'moment'

const Message = ({ text, from, timeCreated, seenBy, isOtherPeople, isNew }) => (
    <div className={`chat-message ${isOtherPeople ? 'other-person-message' : ''} ${isNew ? 'chat-message-new' : ''}`}>
        <div className="chat-message-title">
            {isNew && <span className="message-new-tag" >**new message** </span>}
            {moment(timeCreated).format('LLL')} {from} said: 
        </div>
        <p>{text}</p>
    </div>
)

export default Message
