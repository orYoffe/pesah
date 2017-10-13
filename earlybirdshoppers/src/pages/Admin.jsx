import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import { Link, Redirect } from 'react-router-dom'
import { pageView } from '../helpers/analytics'

// TODO start implementing admin panel to see data and change certain types of data
// TODO block anyone without admin access

class Admin extends Component {
    // state = {
    //     messages: {
    //         error: '',
    //         message: ''
    //     }
    // }

    // setMessage = (type, newMessage) => {
    //     const { messages: { error, message } } = this.state
    //     if (type === 'error') {
    //         if (error !== newMessage) {
    //             this.setState({ messages: { error: newMessage, message: '' }})
    //         }
    //     } else if (type === 'message') {
    //         if (message !== newMessage) {
    //             this.setState({ messages: { message: newMessage, error: '' }})
    //         }
    //     }
    // }

    // emailChange = (e) => {
    //     const value = e.target.value
    //     if (!!value && this.state.email.value !== value) {
    //         this.setState({ email: { value }})
    //     }
    // }

    componentDidMount() {
        pageView();
    }

    render() {
        const { messages: { message, error } } = this.state
        
        if (true) {
            return  <div>Admin panel</div>
        }
    }
}

// const mapDispatchToProps = dispatch => ({ Admin: (user) => dispatch(AdminAction(user)) })

// const mapStateToProps = state => ({isLoggedIn: state.auth.loggedIn})

export default Admin
