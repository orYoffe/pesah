import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { pageView } from '../helpers/analytics'
import { getVenues } from '../helpers/firebase'
import CreateVenue from '../components/CreateVenue/'
import VenueItem from '../components/VenueItem/'

// TODO start implementing admin panel to see data and change certain types of data
// TODO block anyone without admin access

class RenderVenues extends Component {
    state = {
        venues: []
    }
    componentDidMount() {
        pageView();
        getVenues(res => {
            if (res && res.length) {
                this.setState({ venues: res })
            }
        })
    }
    render() {
        const { venues } = this.state
         return !!venues.length && (
            <div>
                <hr />
                <h4>Real Trending Venues</h4>
                <div className="row">
                    {venues.map(venue => <VenueItem key={`venue_item_${venue.uid}`} {...venue} />)}
                </div>
            </div>
        )
    }
}

class Admin extends Component {
    componentDidMount() {
        pageView(); 
    }

    render() {
        const { isAdmin, match } = this.props
        console.log('admin--- match ====', match)
        if (isAdmin) {
            return  (
                <div>
                    <div className="form-group">
                    <h2>Admin panel</h2>
                        <Link to="/admin/create-venue" className="nav-link nav">Create Venue</Link>
                        <Link to="/admin/venues" className="nav-link nav">Explore Venues</Link>
                    </div>
                    <Route
                        path={match.url + '/create-venue'}
                        component={CreateVenue}
                    />
                    <Route
                        path={match.url + '/edit-venue/:venueUid'}
                        component={CreateVenue}
                    />
                    <Route
                        path={match.url + '/venues'}
                        component={RenderVenues}
                    />
                </div>
            )
        }
    }
}

// const mapDispatchToProps = dispatch => ({ Admin: (user) => dispatch(AdminAction(user)) })

const mapStateToProps = state => ({ isAdmin: state.auth.user && state.auth.user.isAdmin })

export default connect(mapStateToProps)(Admin)
