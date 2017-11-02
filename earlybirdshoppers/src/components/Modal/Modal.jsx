import React from 'react'
import PropTypes from 'prop-types'
import './Modal.css'

const Modal = (props) => {
    const { question, onConfirm, onClose } = props
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose}>X</button>
                <div className="modal-question">{question}</div>

                <div className="form-group">
                    <button className="btn btn-success" onClick={onConfirm}>Confirm</button>
                    <button className="btn btn-danger" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

Modal.proptypes = {
    onConfirm: PropTypes.func,
    onClose: PropTypes.func,
    question: PropTypes.oneOf([PropTypes.node, PropTypes.string]),
}

export default Modal