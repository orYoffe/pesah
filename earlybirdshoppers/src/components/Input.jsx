import React from 'react'

const Input = props => (
    <div className={`form-group ${props.className}`}>
        <label htmlFor={props.id}>{props.label}</label>
        <input
            ref={props.refFunc}
            value={props.value}
            required={props.isRequired}
            className={props.inputClassName || "form-control"}
            type={props.type}
            onChange={props.onChange}
            id={props.id}
            placeholder={props.placeholder}
        />
    </div>
)

export default Input