import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { onlyStopPropogation } from '../../helpers/common'
import './Modal.css'

class Modal extends Component {
    proptypes = {
        onConfirm: PropTypes.func,
        onClose: PropTypes.func,
        question: PropTypes.oneOf([PropTypes.node, PropTypes.string]),
    }
    componentDidMount() {
        setTimeout(() => {
            this.content.className = `${this.content.className} open`
        }, 0)
    }
    
    render() {
    const { question, onConfirm, onClose, confirmLabel, cancelLabel } = this.props
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={onlyStopPropogation} ref={ref => this.content = ref}>
                    <button onClick={onClose}>X</button>
                    <div className="modal-question">{question}</div>

                    <div className="form-group">
                        {onConfirm && <button className="btn btn-success" onClick={onConfirm}>{confirmLabel || 'Confirm'}</button>}
                        <button className={`btn ${onConfirm ? 'btn-danger' : 'btn-default'}`} onClick={onClose}>{cancelLabel || (onConfirm ? 'Cancel' : 'Close')}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal