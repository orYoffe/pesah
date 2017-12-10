import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import { turnObjectToArray } from '../../helpers/common'
import { getAnalytics } from '../../helpers/firebase'
import Dropdown from '../Dropdown'

const defaultStatsObject = {
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
}

const defaultState = {
  audioPlays: null,
  pageViews: null,
  musicYouListenedData: null,
  profilePictureData: null,
  profileTrackData: null,
  musicYouListened: null,
  musicYouListenedLabel: null,
  profileTrackLabel: null,
  sortingBy: 'hour',
}


class Stats extends Component {
  state = defaultState

  componentDidMount() {
    this.getArtistData()
  }

  getArtistData = () => {
    const { userId } = this.props

    this.setState(defaultState)
    getAnalytics(`a/${userId}`, (snapshot) => {
      if (snapshot && snapshot.code !== 'storage/object-not-found') {
        const pageViews = snapshot.val()
        if (pageViews) {
          this.setStatsData(pageViews, 'pageViews')
        }
      }
    })
    getAnalytics(`${userId}/audio/play`, (snapshot) => {
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

  render() {
    const { isLoggedIn, userId, match } = this.props
    if (!isLoggedIn || !userId) {
      return null
    }
    const {
      audioPlays,
      audioPlaysLabel,
      pageViews,
      pageViewsLabel,
      musicYouListened,
      musicYouListenedLabel,
      sortingBy,
    } = this.state
    return (
      <div key={`analytics_stats_${userId}`}>
        <Link to={match.url.replace('/stats', '')}>Stats</Link>
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
                    ...defaultStatsObject,
                    label: 'Page views',
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
                    ...defaultStatsObject,
                    label: 'Track plays',
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
                    ...defaultStatsObject,
                    label: 'Tracks you listened to',
                    data: musicYouListened
                  }
                ]
              }}
              />
          ) : 0}
        </div>
        <br />
      </div>
    )
  }
}


const mapStateToProps = state => ({
  isLoggedIn: state.auth.loggedIn,
  userId: state.auth.user && state.auth.user.uid,
})

export default connect(mapStateToProps)(Stats)
