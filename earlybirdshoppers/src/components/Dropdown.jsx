import React from 'react'
import PropTypes from 'prop-types'

const Dropdown = props => {
    const { options, value, defaultValue, onSelect, className, label, id } = props
    const select = (
        <select onChange={onSelect}
        value={value}
        defaultValue={defaultValue}
        className={`form-control ${className}`} id={id}>
            <option
                value=""
                key="empty_option_01" disabled>{!!label && label}</option>
            {options.map((option, index) => (
                <option
                    value={option.value}
                    key={`${option.value}_option_${index}`}>{option.label || option.value}</option>
            ))}
        </select>
    )
    if (label) {
       return <label htmlFor={id}>{label}{select}</label>
    }
    return select
}

Dropdown.proptypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    onSelect: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
}


export default Dropdown