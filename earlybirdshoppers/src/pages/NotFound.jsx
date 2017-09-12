import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class NotFound extends Component {

    render() {
        return (
            <div className="NotFound">
              <h3>404 Page Not Found <span role="img" aria-label="oops">🤷‍♀️</span></h3>
              <br />
              <Link to="/">Go Back Home</Link>
            </div>
        )
    }
}

export default NotFound
