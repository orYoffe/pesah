import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { pageView } from '../helpers/analytics'

class NotFound extends Component {

    componentDidMount() {
        pageView('404');
    }

    render() {
        return (
            <div className="NotFound text-center">
              <h3>404 Page Not Found <span role="img" aria-label="oops">🤷‍</span></h3>
              <br />
              <Link to="/">Go Back Home</Link>
            </div>
        )
    }
}

export default NotFound
