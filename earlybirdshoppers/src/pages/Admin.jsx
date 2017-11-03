import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { pageView } from '../helpers/analytics'
import CreateVenue from '../components/CreateVenue'
import Venues from '../components/Venues'

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
                        component={Venues}
                    />
                </div>
            )
        }
    }
}

// const mapDispatchToProps = dispatch => ({ Admin: (user) => dispatch(AdminAction(user)) })

const mapStateToProps = state => ({ isAdmin: state.auth.user && state.auth.user.isAdmin })

export default connect(mapStateToProps)(Admin)
