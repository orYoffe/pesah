import React from 'react'
import PropTypes from 'prop-types'

const Checkbox = props => (
    <label className="checkbox">
        <input
            type="checkbox"
            checked={props.checked}
            onChange={props.onChange}
        />
        {props.label}
    </label>
)

Checkbox.proptypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    label: PropTypes.string,
}

export default Checkbox