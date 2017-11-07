import React, { Component } from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
import { getPhotoUrl } from '../../helpers/firebase'
import '../UserItem.css'
import './ArtistItem.css'

class ArtistItem extends Component {
    state = {
        pic: null
    }
    proptypes = {
        name: Proptypes.string.isRequired,
        location: Proptypes.string.isRequired,
        uid: Proptypes.number.isRequired,
    }
    componentDidMount() {
        getPhotoUrl(this.props.uid, 'profilePicture', (url) => {
            if (url.code !== 'storage/object-not-found') {
                this.setState({ pic: url })
            }
        })
    }
    
    render() {
        const { pic } = this.state
        const {
            name,
            location,
            uid,
            displayName,
            events,
        } = this.props
        return (
            <div className="col-sm-6 col-xs-12">
                <Link to={`/artist/${uid}`} className="artist-item item user-item">
                    <div className="artist-item-content user-item-content">
                        {pic && <img src={pic} alt="artist" className="pull-right" height="50" width="50"/>}
                        <h4>Artist name: {name || displayName}</h4>
                        {location &&<p>Based in: {location}</p>}
                        {events && Object.keys(events).length && 'has ' + Object.keys(events).length + ' events'}
                    </div>
                </Link>
            </div>
        )
    }
}


export default ArtistItem