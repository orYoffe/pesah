import React, { Component } from 'react'
import { connect } from 'react-redux'
import { pageView } from '../helpers/analytics'
import { getMusician, getPhotoUrl } from '../helpers/firebase'
import { verifyEmail } from '../helpers/auth'
import { setProfilePicture } from '../reducers/auth'
import NotFound from './NotFound'
import Loader from '../components/Loader'
import OpenChat from '../components/OpenChat'
import FileInput from '../components/FileInput'

const defaultState = {
    musician: null,
    image: null,
    profilePicture: null,
}

class Musician extends Component {
    state = defaultState

    componentDidMount() {
        const { userId } = this.props
        const { id } = this.props.match.params
        pageView('musician', { page: id, userId })
        this.getMusicianData()
    }


    renderMusicianEdit = () => {
        const { userId, emailVerified } = this.props
        const { id } = this.props.match.params

        if (userId === id) {
            if (!emailVerified) {
                return (
                    <div>
                        Please verify your email. and then refresh the page
                        <br />
                        <button className="btn btn-primary" onClick={verifyEmail} >Click here to send another email for verification</button>
                    </div>
                )
            }
            return (
                <div>
                    <FileInput
                        key={`FileInput_profilepic_${id}`}
                        userUid={userId}
                        filePurpose="profilePicture"
                        label="Upload a profile picture (max size 5MB)"
                        id="musician_profilePicture_upload_input"
                        type="image"
                        />,
                </div>
            )
        }
    }

    getMusicianData = () => {
        const { id } = this.props.match.params

        this.setState(defaultState)
        getMusician(id, snapshot => {
            const musician = snapshot && snapshot.val()
            this.setState({ musician: musician || 'not found' })
            getPhotoUrl(id, 'profilePicture', (profilePicture) => {
                if (profilePicture.code !== 'storage/object-not-found') {
                    this.setState({ profilePicture })
                }
            })
        })
        .catch(snapshot => {
            this.setState({ musician: 'not found' })
        })
    }



    render() {
        const { musician, profilePicture } = this.state

        if(musician === 'not found') {
            return <NotFound />
        } else if(!musician) {
            return <Loader />
        }
        const { userId, isLoggedIn } = this.props
        const { displayName, email, uid, photoURL } = musician
        console.log('musician', musician)
        return (
            <div className="page">
                <div className="page-content">
                    {this.renderMusicianEdit()}
                    {email && <h5> email: {email} </h5>}
                    {profilePicture && <img src={profilePicture} alt="profile" height="100" width="100"/>}
                    {displayName && <h5> displayName: {displayName} </h5>}
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
    emailVerified: state.auth.user && state.auth.user.emailVerified,
})

export default connect(mapStateToProps, mapDispatchToProps)(Musician)
