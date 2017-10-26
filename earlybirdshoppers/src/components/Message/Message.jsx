import React from 'react'

const Message = ({ text, from, timeCreated, seenBy }) => (
    <div>
        <div>at {timeCreated}</div>
        <div>{from} said:</div>
        <p>{text}</p>
    </div>
)

export default Message
