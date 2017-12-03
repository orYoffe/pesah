import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import ReactAudioPlayer from 'react-audio-player'
import { pageView, sendAudioEvent } from '../helpers/analytics'
import { getArtist, getPhotoUrl, getTrackUrl, setYoutubeUrl } from '../helpers/firebase'
import { setProfilePicture } from '../reducers/auth'
import NotFound from './NotFound'
import EventItem from '../components/EventItem'
import Loader from '../components/Loader'
import OpenChat from '../components/OpenChat'
import FileInput from '../components/FileInput'
import Stats from '../components/Stats'
import BookingArtistPanel from '../components/Booking/BookingArtistPanel'

const youtubeRegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i; // eslint-disable-line no-useless-escape
const defaultState = {
    artist: null,
    image: null,
    audioPlays: null,
    pageViews: null,
    profilePicture: null,
    profileTrack: null,
    youtubeError: null,
    youtubeSuccess: null,
}

class Artist extends Component {
    state = defaultState

    componentDidMount() {
        const { userId } = this.props
        const { id } = this.props.match.params
        pageView('artist', { page: id, userId })

        this.getArtistData()
        this.getArtistData()
    }

    setYoutubeVideo = e => {
        e && e.preventDefault()
        const url = this.youtubeUrl.value.trim()
        const match = url.match(youtubeRegexp)

        if (match[1]) {
            setYoutubeUrl({ youtubeURL: url }, res => {
                if (res && res.errorCode) {
                    this.setState({
                        youtubeError: true,
                        youtubeSuccess: false,
                    })
                } else {
                    this.setState({
                        youtubeError: false,
                        youtubeSuccess: true,
                    })
                }
            })
        } else {
            this.setState({
                youtubeError: true,
                youtubeSuccess: false,
            })
        }

    }

    renderArtistEdit = () => {
        const { userId, match } = this.props
        const { id } = this.props.match.params
        const { youtubeError, youtubeSuccess } = this.state

        if (userId === id) {
            return [
                <Route key={`statsRoute_${id}`} path={`${match.url}/stats`} component={Stats} />,
                <Link key={`statsLink_${id}`} to={`${match.url}/stats`} >Stats</Link>,
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
                </div>,
                <h4 key={`music_input_video_${id}_title`}>Add a youtube video</h4>,
                <form key={`music_input_video_${id}`} onSubmit={this.setYoutubeVideo}>
                    <input className="form-control" ref={ref => this.youtubeUrl = ref}
                        type="text" placeholder="http://www.youtube.com/watch?v=..." />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="submit">Save</button>
                    </span>
                </form>,
                youtubeSuccess && <div key={`music_input_video_${id}_youtubeSuccess`}>Video saved</div>,
                youtubeError && <div key={`music_input_video_${id}_youtubeError`} className="error">There was a problem with the youtube url you provided</div>,
            ]
        }
    }

    getArtistData = () => {
        const { id } = this.props.match.params

        this.setState(defaultState)
        getArtist(id, snapshot => {
            const artist = snapshot && snapshot.val()
            this.setState({ artist: artist || 'not found' })
            getPhotoUrl(id, 'profilePicture', (profilePicture) => {
                if (profilePicture.code !== 'storage/object-not-found') {
                    this.setState({ profilePicture })
                }
            })
            getTrackUrl(id, 'profileTrack', (profileTrack) => {
                if (profileTrack.code !== 'storage/object-not-found') {
                    this.setState({ profileTrack })
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
                        {events.map(event => (
                            <EventItem
                                key={`event_item_${artist.events[event].uid}`}
                                {...artist.events[event]}
                                />
                        ))}
                    </div>
                </div>
            )
        }
    }

    onAudioPlay = () => {
        const { userId } = this.props
        const { id } = this.props.match.params
        sendAudioEvent('artist', { page: id, userId, audio: 'play' })
    }
    onAudioEnded = () => {
        const { userId } = this.props
        const { id } = this.props.match.params
        sendAudioEvent('artist', { page: id, userId, audio: 'ended' })
    }

    render() {
        const { artist, profilePicture, profileTrack } = this.state

        if(artist === 'not found') {
            return <NotFound />
        } else if(!artist) {
            return <Loader />
        }
        const { userId, isLoggedIn } = this.props
        const { displayName, email, uid, photoURL, youtubeID } = artist
        console.log('artist', artist)
        return (
            <div className="page">
                <div className="page-content">
                    {this.renderArtistEdit()}
                    {youtubeID && (
                        <iframe id="ytplayer" title="artist youtube video" type="text/html" width="560" height="315"
                        src={`https://www.youtube.com/embed/${youtubeID}`}
                        frameBorder="0" allowFullScreen />
                    )}
                    {email && <h5> email: {email} </h5>}
                    {profilePicture && <img src={profilePicture} alt="profile" height="100" width="100"/>}
                    {profileTrack && (
                        <ReactAudioPlayer
                        src={profileTrack}
                        controls
                        onPlay={this.onAudioPlay}
                        onError={this.onAudioEnded}
                        />
                    )}
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
