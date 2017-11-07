import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUser } from '../helpers/firebase'
import NotFound from './NotFound'
// import EventItem from '../components/EventItem/'
import Loader from '../components/Loader/'
import { pageView } from '../helpers/analytics'
import OpenChat from '../components/OpenChat/'
import '../components/FanItem/FanItem.css'

class Fan extends Component {
    state = {
        fan: null
    }

    componentDidMount() {
        pageView();

        const { id } = this.props.match.params
        getUser(id, snapshot => {
            const fan = snapshot && snapshot.val()
            this.setState({ fan: fan || 'not found' })
        })
        .catch(snapshot => {
            this.setState({ fan: 'not found' })
        })
    }

    render() {     
        // TODO if the fan belongs to the user show edit options
        const { fan } = this.state
        
        if(fan === 'not found') {
            return <NotFound />
        } else if(!fan) {
            return <Loader />
        }
        const { email, displayName, uid, photoURL } = fan
        const { userId, isLoggedIn } = this.props
        const content = (<div className="page-content">
                        <h5> email: {email} </h5>
                        {isLoggedIn && uid !== userId && (
                            <OpenChat
                            chatPartner={{
                                uid: uid,
                                photo: photoURL || '',
                                displayName: displayName
                            }} />
                            )
                        }
                    </div>)

        console.log('fan', fan)
        return (
            <div className="page">
                {content}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.loggedIn,
    userId: state.auth.user && state.auth.user.uid,
})

export default connect(mapStateToProps)(Fan)

