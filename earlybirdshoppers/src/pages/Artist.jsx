import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactAudioPlayer from 'react-audio-player'
import { Line } from 'react-chartjs-2'
import { pageView, sendAudioEvent } from '../helpers/analytics'
import { turnObjectToArray } from '../helpers/common'
import { getArtist, getPhotoUrl, getTrackUrl, getAnalytics } from '../helpers/firebase'
import { setProfilePicture } from '../reducers/auth'
import NotFound from './NotFound'
import EventItem from '../components/EventItem'
import Loader from '../components/Loader'
import OpenChat from '../components/OpenChat'
import FileInput from '../components/FileInput'
import Dropdown from '../components/Dropdown'
import BookingArtistPanel from '../components/Booking/BookingArtistPanel'

const defaultState = {
    artist: null,
    image: null,
    audioPlays: null,
    pageViews: null,
    musicYouListenedData: null,
    profilePictureData: null,
    profileTrackData: null,
    musicYouListened: null,
    profilePicture: null,
    profileTrack: null,
    musicYouListenedLabel: null,
    profilePictureLabel: null,
    profileTrackLabel: null,
    sortingBy: 'hour'
}

class Artist extends Component {
    state = defaultState

    componentDidMount() {
        const { userId } = this.props
        const { id } = this.props.match.params
        pageView('artist', { page: id, userId })

        this.getArtistData()
    }
    renderArtistEdit = () => {
        const { userId } = this.props
        const { id } = this.props.match.params
        const {
            audioPlays,
            audioPlaysLabel,
            pageViews,
            pageViewsLabel,
            musicYouListened,
            musicYouListenedLabel,
            sortingBy,
        } = this.state

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
                </div>,
                <div key={`analytics_stats_${id}`}><h4>Stats</h4>
                <br />
                    <Dropdown
                    className="col-md-6"
                    value={sortingBy}
                    onSelect={this.onStatsChange}
                    options={[
                        {label: 'Day', value: 'day'},
                        {label: 'Hour', value: 'hour'},
                    ]}
                    label="Sort by"
                    id="artists_stats_sorting"
                    />
                <div className="chart">
                pageViews: {pageViews ? (
                    <Line
                        data={{
                          labels: pageViewsLabel,
                          datasets: [
                            {
                              label: 'Page views',
                              fill: false,
                              lineTension: 0.1,
                            //   backgroundColor: 'rgba(255,255,255,1)',
                              borderColor: 'rgba(75,192,192,1)',
                              borderCapStyle: 'butt',
                              borderDash: [],
                              borderDashOffset: 0.0,
                              borderJoinStyle: 'miter',
                              pointBorderColor: 'rgba(12,12,12,1)',
                              pointBackgroundColor: '#fff',
                              pointBorderWidth: 1,
                              pointHoverRadius: 5,
                              pointHoverBackgroundColor: 'rgba(12,12,12,1)',
                              pointHoverBorderColor: 'rgba(220,220,220,1)',
                              pointHoverBorderWidth: 2,
                              pointRadius: 1,
                              pointHitRadius: 10,
                              data: pageViews
                            }
                          ]
                        }}
                        />
                ) : 0}
                </div>
                <div className="chart">
                 audioPlays: {audioPlays ? (
                     <Line
                         data={{
                           labels: audioPlaysLabel,
                           datasets: [
                             {
                               label: 'Track plays',
                               fill: false,
                               lineTension: 0.1,
                               backgroundColor: 'rgba(255,255,255,0.4)',
                               borderColor: 'rgba(75,192,192,1)',
                               borderCapStyle: 'butt',
                               borderDash: [],
                               borderDashOffset: 0.0,
                               borderJoinStyle: 'miter',
                               pointBorderColor: 'rgba(12,12,12,1)',
                               pointBackgroundColor: '#fff',
                               pointBorderWidth: 1,
                               pointHoverRadius: 5,
                               pointHoverBackgroundColor: 'rgba(12,12,12,1)',
                               pointHoverBorderColor: 'rgba(220,220,220,1)',
                               pointHoverBorderWidth: 2,
                               pointRadius: 1,
                               pointHitRadius: 10,
                               data: audioPlays
                             }
                           ]
                         }}
                         />
                ): 0}
            </div>
                <br />
                <div className="chart">
                musicYouListened: {musicYouListened ? (
                    <Line
                        data={{
                          labels: musicYouListenedLabel,
                          datasets: [
                            {
                              label: 'Tracks you listened to',
                              fill: false,
                              lineTension: 0.1,
                              backgroundColor: 'rgba(255,255,255,0.4)',
                              borderColor: 'rgba(75,192,192,1)',
                              borderCapStyle: 'butt',
                              borderDash: [],
                              borderDashOffset: 0.0,
                              borderJoinStyle: 'miter',
                              pointBorderColor: 'rgba(12,12,12,1)',
                              pointBackgroundColor: '#fff',
                              pointBorderWidth: 1,
                              pointHoverRadius: 5,
                              pointHoverBackgroundColor: 'rgba(12,12,12,1)',
                              pointHoverBorderColor: 'rgba(220,220,220,1)',
                              pointHoverBorderWidth: 2,
                              pointRadius: 1,
                              pointHitRadius: 10,
                              data: musicYouListened
                            }
                          ]
                        }}
                        />
                ) : 0}
            </div>
                <br />
            </div>
        ]
    }
}
getArtistData = () => {
    const { userId } = this.props
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
        if (userId === id) {
            getAnalytics(`artist/${id}`, (snapshot) => {
                if (snapshot && snapshot.code !== 'storage/object-not-found') {
                    const pageViews = snapshot.val()
                    if (pageViews) {
                        this.setStatsData(pageViews, 'pageViews')
                    }
                }
            })
            getAnalytics(`${id}/audio/play`, (snapshot) => {
                if (snapshot && snapshot.code !== 'storage/object-not-found') {
                    const audioPlays = snapshot.val()
                    if (audioPlays) {
                        this.setStatsData(audioPlays, 'audioPlays')
                    }
                }
            })
            getAnalytics(`${userId}/listened`, (snapshot) => {
                if (snapshot && snapshot.code !== 'storage/object-not-found') {
                    const musicYouListened = snapshot.val()
                    if (musicYouListened) {
                        this.setStatsData(musicYouListened, 'musicYouListened')
                    }
                }
            })
        }
    })
    .catch(snapshot => {
        this.setState({ artist: 'not found' })
    })
}

getHourString = date => {
    const hour = date.getHours()
    const ampm = hour >= 12 ? 'pm' : 'am'
    return `${date.toLocaleDateString()} ${hour % 12 ? hour + ampm : 12 + ampm}`
}

getTimeString = (date, sortingBy) => {
    switch (sortingBy) {
        case 'day':
            return date.toLocaleDateString()
        case 'hour':
            return this.getHourString(date)
        default:
            return date.toLocaleDateString()

    }
}

setStatsData = (data, key, sortBy) => {
    if (!data && !this.state[key + 'Data']) {
        return
    }
    const sortingBy = sortBy || this.state.sortingBy
    const analyticsData = data || this.state[key + 'Data']
    const statsDates = {}
    const statsArray = turnObjectToArray(analyticsData)
    statsArray.forEach(item => {
        const date = new Date(item.time)
        const localDate = this.getTimeString(date, sortingBy)
        if (!statsDates[localDate]) {
            statsDates[localDate] = []
        }
        statsDates[localDate].push(date)
    })
    const labels = Object.keys(statsDates)
    const newState = { [key]:  labels.map(key => statsDates[key].length), [key + 'Label']: labels}
    if (!this.state[key + 'Data']) {
        newState[key + 'Data'] = analyticsData
    }
    if (!this.state.sortingBy !== sortingBy) {
        newState.sortingBy = sortingBy
    }
    this.setState(newState)
}

onStatsChange = e => {
    this.setStatsData(this.state.musicYouListenedData, 'musicYouListened', e.target.value)
    this.setStatsData(this.state.audioPlaysData, 'audioPlays', e.target.value)
    this.setStatsData(this.state.pageViewsData, 'pageViews', e.target.value)
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
            // TODO if the artist belongs to the user show edit options
            const { artist, profilePicture, profileTrack } = this.state
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
            const { displayName, email, uid, photoURL } = artist
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
                            onPlay={this.onAudioPlay}
                            onError={this.onAudioEnded}
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
