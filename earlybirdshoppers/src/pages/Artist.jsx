import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactAudioPlayer from 'react-audio-player'
import { pageView } from '../helpers/analytics'
import { getArtist, getPhotoUrl, getTrackUrl } from '../helpers/firebase'
import { setProfilePicture } from '../reducers/auth'
import NotFound from './NotFound'
import EventItem from '../components/EventItem'
import Loader from '../components/Loader'
import OpenChat from '../components/OpenChat'
import FileInput from '../components/FileInput'
import BookingArtistPanel from '../components/Booking/BookingArtistPanel'

class Artist extends Component {
    state = {
        artist: null,
        image: null,
    }

    componentDidMount() {
        pageView();

        this.getArtistData()
    }
    renderArtistEdit = () => {
        const { userId } = this.props
        const { id } = this.props.match.params

        if (userId === id) {
            return [
                <BookingArtistPanel key={`BookingArtistPanel_${id}`} uid={id} />,
                <FileInput
                    key={`FileInput_profilepic_${id}`}
                    userUid={userId}
                    filePurpose="profilePicture"
                    label="Upload a profile picture (max size 5MB)"
                    id="artist_profilePicture_upload_input"
                    type="image"
                />,
              <div key={`FileInput_track_${id}`}>
                <h4>Upload your track</h4>
                  <FileInput
                      userUid={userId}
                      filePurpose="profileTrack"
                      label="Upload a track (only audio formats supported, max size 15MB)"
                      type="track"
                      id="artist_profileTrack_upload_input"
                  />
              </div>
            ]
        }
    }
    getArtistData = () => {
        const { id } = this.props.match.params

        getArtist(id, snapshot => {
            const artist = snapshot && snapshot.val()
            this.setState({ artist: artist || 'not found' })
            getPhotoUrl(id, 'profilePicture', (profilePicture) => {
                if (profilePicture.code !== 'storage/object-not-found') {
                    this.setState(state => ({ artist: { ...state.artist, profilePicture} }))
                }
            })
            getTrackUrl(id, 'profileTrack', (profileTrack) => {
                if (profileTrack.code !== 'storage/object-not-found') {
                    this.setState(state => ({ artist: { ...state.artist, profileTrack} }))
                }
            })
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
        const { displayName, email, uid, photoURL, profilePicture, profileTrack } = artist
        console.log('artist', artist)
        return (
            <div className="page">
                <div className="page-content">
                    {this.renderArtistEdit()}
                    {email && <h5> email: {email} </h5>}
                    {profilePicture && <img src={profilePicture} alt="profile" height="100" width="100"/>}
                    {profileTrack && <ReactAudioPlayer
                                      src={profileTrack}
                                      controls
                                    />}
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
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setProfilePicture: image => dispatch(setProfilePicture(image)),
})
const mapStateToProps = state => ({
    isLoggedIn: state.auth.loggedIn,
    userId: state.auth.user && state.auth.user.uid,
})

export default connect(mapStateToProps, mapDispatchToProps)(Artist)
