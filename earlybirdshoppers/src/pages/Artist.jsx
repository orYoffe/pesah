import React, { Component } from 'react'
import { connect } from 'react-redux'
import { events, artists } from '../helpers/mockData'
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
        
        const { id } = this.props.match.params
        let artist = artists.find(artist => parseInt(id,10) === artist.id)

        if (!artist) {
            getArtist(id, snapshot => {
                artist = snapshot.val()
                this.setState({ artist: artist || 'not found' })
            })
            .catch(snapshot => {
                this.setState({ artist: 'not found' })
            })
        } else {
            this.setState({ artist })
        }
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
        let content
        
        if(artist === 'not found') {
            return <NotFound />
        } else if(!artist) {
            return <Loader />
        }
        if(artist.id) {
            // fake data
            const {
                events: artistEvents,
                location,
                name,
                youtubeVideo,
                bandcampVideo,
                bandcampLink,
                bandcampText,
            } = artist
            const currentEvents = events.filter(event => artistEvents.indexOf(event.id) !== -1)

            content = (
                        <div className="page-content">
                            <h3>Artist name: {name}</h3>
                            {youtubeVideo && (
                                <div className="col-xs-12 col-sm-6">
                                    <iframe
                                        title={`${name} Youtube video`}
                                        src={youtubeVideo}
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                            {bandcampVideo && (
                                <div className="col-xs-12 col-sm-6">
                                    <iframe
                                        title={`${name} Bandcamp Album`}
                                        frameBorder="0"
                                        src={bandcampVideo}
                                        seamless
                                        style={{
                                            border: '0',
                                            width: '350px',
                                            height: '470px'
                                        }}
                                    >
                                    <a target="_blank" href={bandcampLink}>{bandcampText}</a>
                                    </iframe>
                                </div>
                            )}
                            <h4>Based in: {location}</h4>
                            <h4>Events:</h4>
                            <div className="row">
                                {currentEvents && currentEvents.map(event => <EventItem key={`event_item_${event.id}`} {...event} /> )}
                            </div>
                        </div>
                    )
        } else {
            const { userId, isLoggedIn } = this.props
            const { displayName, email, uid, photoURL } = this.state.artist
            content = (
                <div className="page-content">
                    <h5> email: {email} </h5>
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
        }

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
    userId: state.auth.user.uid,
})

export default connect(mapStateToProps)(Artist)
