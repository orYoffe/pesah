import React from 'react'
import PropTypes from 'prop-types'

const RadioButtons = props => (
    <div>
        <p>{props.label}</p>
        {props.options.map((option, index) => {
            const key = `radio_${props.name}_${props.checked}_${index}`
            return (
                <div className="radio" key={key}>
                    <label>
                        <input type="radio"
                            checked={props.checked === option}
                            onChange={props.onChange} name={props.name} id={key} value={option} />
                        {option}
                    </label>
                </div>
            )
        })}
    </div>
)

RadioButtons.proptypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array,
}

export default RadioButtons