import React, { Component } from 'react'
import ExploreCalendar from '../components/ExploreCalendar'
import Map from '../components/Map'

class Explore extends Component {

    render() {
        return (
            <div className="Explore">
              <h3>Explore Artists, Venues, and Clubs by region, dates and category :)</h3>
              <hr/>
              <ExploreCalendar />
              <hr/>
              <Map />
            </div>
        )
    }
}

export default Explore
