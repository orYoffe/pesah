import React from 'react'

const Input = props => (
    <div className={`form-group ${props.className}`}>
        <label htmlFor={props.id}>{props.label}</label>
        <input
            ref={props.refFunc}
            required={props.isRequired}
            value={props.value || ''}
            className={props.inputClassName || "form-control"}
            type={props.type}
            onChange={props.onInputChange}
            id={props.id}
            placeholder={props.placeholder}
        />
    </div>
)

export default Input