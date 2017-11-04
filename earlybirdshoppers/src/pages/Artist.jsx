import React, { Component } from 'react'
import { connect } from 'react-redux'
import { pageView } from '../helpers/analytics'
import { getArtist } from '../helpers/firebase'
import NotFound from './NotFound'
import EventItem from '../components/EventItem/'
import Loader from '../components/Loader/'
import OpenChat from '../components/OpenChat/'

class Artist extends Component {
    state = {
        artist: null
    }

    componentDidMount() {
        pageView();
        
        this.getArtistData()
    }
    
    getArtistData = () => {
        const { id } = this.props.match.params

        getArtist(id, snapshot => {
            const artist = snapshot && snapshot.val()
            this.setState({ artist: artist || 'not found' })
        })
        .catch(snapshot => {
            this.setState({ artist: 'not found' })
        })
    }

    renderEvents = () => {
        const { artist } = this.state
        const events = artist.events && Object.keys(artist.events)
        if (events && events.length) {
            return (
                <div>
                    <hr />
                    <h4>Artist Events</h4>
                    <div className="row">
                        {events.map(event =>
                        <EventItem key={`event_item_${artist.events[event].uid}`} {...artist.events[event]} />)}
                    </div>
                </div>
            )
        }
    }

    render() {     
        // TODO if the artist belongs to the user show edit options
        const { artist } = this.state
        const { id } = this.props.match.params

        if (artist && id !== artist.uid) {
            this.getArtistData()
        }
        
        if(artist === 'not found') {
            return <NotFound />
        } else if(!artist) {
            return <Loader />
        }
        const { userId, isLoggedIn } = this.props
        const { displayName, email, uid, photoURL } = this.state.artist
        const content = (
            <div className="page-content">
                {email && <h5> email: {email} </h5>}
                {displayName && <h5> displayName: {displayName} </h5>}
                {this.renderEvents()}
                {isLoggedIn && uid !== userId && (
                    <OpenChat
                    chatPartner={{
                        uid: uid,
                        photo: photoURL || '',
                        displayName: displayName
                    }} />
                    )
                }
            </div>
        )

        console.log('artist', artist)
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

export default connect(mapStateToProps)(Artist)
