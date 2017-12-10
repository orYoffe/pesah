import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getLocation } from '../../helpers/common'
// import '../UserItem.css'
// import './CreateArtist.css'
import { createArtist, checkArtistUrl } from '../../helpers/firebase'
import GSearchInput from '../GSearchInput/'
import Map from '../Map'

class CreateArtist extends Component {
    state = {
        profileUrl: '',
        error: '',
        errors: [],
        values: null,
        location: false,
    }

    isValid = ({
        title, location,  description, style, genre, profileUrl,
    }) => {
        const errors = []
        let error = ''

        if (title.length < 5) {
            errors.push('title')
            error = `

            Title must be longer than 4 chars
            `
        }
        if (description.length < 5) {
            errors.push('description')
            error = `

            description must be longer than 4 chars
            `
        }
        if (style.length < 5) {
            errors.push('style')
            error = `

            style must be longer than 4 chars
            `
        }
        if (genre.length < 5) {
            errors.push('genre')
            error = `

            genre must be longer than 4 chars
            `
        }

        const url = profileUrl.trim().replace(/ /g, '_').replace(/[^\w\s]/gi, '');
        if (url.length < 1) {
            this.setMessage('error', 'Please enter a proper Profile url.')
            return false
        }

        if (
            !location ||
            !location.city ||
            !location.country ||
            !location.countryShortName ||
            !location.address ||
            !location.lat ||
            !location.lng
        )  {
            errors.push('location')
            error = `${error}

            Location is required
            `
        }

        if (errors.length) {
            this.setState({ error, errors })
            return false
        }

        return true
    }

    onSubmit = e => {
        e.preventDefault()
        const { profileUrl, location } = this.state

        const title = this.artistTitle.value.trim()
        const description = this.description.value.trim()
        const style = this.style.value.trim()
        const genre = this.genre.value.trim()

        if (this.isValid({
            title, location,  description, style, genre, profileUrl,
        })) {
            const error = createArtist({
                title, description, style, genre, profileUrl,
                location,
            })
            if (error && error.then) {
                error.then(artist => {
                    // debugger
                    console.log(' new artist ===', artist)
                    if (artist && artist.code === 200) {

                        this.props.history.push(`/a/${profileUrl}`)
                    }
                }).catch(err => {
                    // TODO handle errors
                    console.log('error ===', err)
                })
            } else {
                switch (error) {
                    case 'login':
                        return this.setState({ error: 'Please Login to Create Artist', errors: [] })
                    case 'verifyemail':
                        return this.setState({
                            error: 'Please verify your email in order to Create Artist you need to verify your email',
                            errors: []
                        })
                    default:
                    this.setState({error: '', errors: []})
                        break
                }
            }
        }
    }


    profileUrlChange = (e) => {
        const value = e.target.value
        const url = value && value.trim().replace(/ /g, '_').replace(/[^\w\s]/gi, '');
        if (!!url && this.state.profileUrl.value !== url) {
            checkArtistUrl(value, (isUrlFree) => {
                if (isUrlFree) {
                    this.setState({ profileUrl: url })
                } else {
                    this.setMessage('error', 'This profile url is taken, please choose another.')
                }
            })
        }
    }
    onPlacesChanged = () => {
        const place = this.artistLocation.getPlaces()[0]
        const location = getLocation(place)
        if (place && location) {
            this.setState({ location })
        } else if (this.state.location) {
            this.setState({ location: null })
        }
    }

    render() {
        const { error, errors, location, profileUrl } = this.state

        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    {error && <div className="error" >{error}</div>}
                    <div className={`form-group ${errors.indexOf('title') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="artistTitle">Artist Title</label>
                        <input
                            ref={node => this.artistTitle = node}
                            required
                            className="form-control"
                            type="text"
                            id="artistTitle"
                            placeholder="Artist Title" />
                    </div>
                    <div className={`form-group ${errors.indexOf('description') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="description">Artist description</label>
                        <input
                            ref={node => this.description = node}
                            required
                            className="form-control"
                            type="text"
                            id="description"
                            placeholder="Artist description" />
                    </div>
                    <div className={`form-group ${errors.indexOf('genre') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="genre">Artist genre</label>
                        <input
                            ref={node => this.genre = node}
                            required
                            className="form-control"
                            type="text"
                            id="genre"
                            placeholder="Artist genre" />
                    </div>
                    <div className={`form-group ${errors.indexOf('style') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="style">Artist style</label>
                        <input
                            ref={node => this.style = node}
                            required
                            className="form-control"
                            type="text"
                            id="style"
                            placeholder="Artist style" />
                    </div>
                    <div className={`form-group ${errors.indexOf('style') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="profileUrl">Profile Url:</label>
                        <input
                            className="form-control"
                            type="text"
                            onChange={this.profileUrlChange}
                            id="profileUrl"
                            name="profileUrl"
                            placeholder="The_Great_Piano_Man"
                            required
                        />
                    </div>
                    {profileUrl && <p>
                        Your full url will be: www.raisethebar/a/{profileUrl.replace(/ /g, '_').replace(/[^\w\s]/gi, '')}
                    </p>}
                    <div className={`form-group ${errors.indexOf('location') !== -1 ? 'has-warning' : ''} `}>
                        <label htmlFor="artistLocation">Artist Location</label>
                        <GSearchInput
                            placeholder="Somewhere street 54"
                            className="form-control"
                            id="artistLocation"
                            refrence={node => this.artistLocation = node}
                            onPlacesChanged={this.onPlacesChanged}
                        />
                    </div>
                    {location && (
                        <div className="col-md-12">
                            <Map markers={[
                                {
                                    position: { lng: location.lng, lat: location.lat }
                                },
                            ]} />
                        </div>
                    )}
                    <input
                        className="btn btn-primary form-control"
                        onClick={this.onSubmit}
                        type="submit"
                        value="Create Artist"
                    />
                </form>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    trans: state.locale.trans,
    accountType: state.auth.user && state.auth.user.accountType,
})

export default connect(mapStateToProps)(CreateArtist)
