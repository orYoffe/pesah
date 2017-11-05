import React from 'react'

const Input = props => (
    <div className={`form-group ${props.className}`}>
        <label htmlFor={props.id}>{props.label}</label>
        <textarea
            placeholder={props.placeholder}
            ref={props.refFunc}
            required={props.isRequired}
            className={props.inputClassName || "form-control"}
            type={props.type}
            onChange={props.onChange}
            id={props.id}
            cols="30" rows="10">{props.children}</textarea>
    </div>
)

export default Input