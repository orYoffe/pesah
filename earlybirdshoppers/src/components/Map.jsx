import React from 'react'
import { connect } from 'react-redux'
import noop from 'lodash/noop'
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps'

const Gmap = withGoogleMap(({
  markers,
  onMapLoad,
  onMapClick,
  onMarkerRightClick,
}) => (
  <GoogleMap
    ref={onMapLoad}
    defaultZoom={11}
    defaultCenter={{ lat: 32.111767, lng: 34.801361 }}
    onClick={onMapClick}
  >
    {markers && markers.map((marker, index) => (
      <Marker
          key={`marker_${marker.position.lat}_${marker.position.lng}`}
        {...marker}
        onRightClick={() => onMarkerRightClick(index)}
      />
    ))}
  </GoogleMap>
));
const Map = ({
  markers,
  onMapLoad,
  onMapClick,
  onMarkerRightClick,
  isMapsReady,
}) => (
    isMapsReady && <Gmap
    containerElement={
      <div style={{ height: `100%`, minHeight: '200px' }} />
    }
    mapElement={
      <div style={{ height: `100%`, minHeight: '200px' }} />
    }
    onMapLoad={noop}
    onMapClick={noop}
    markers={markers}
    onMarkerRightClick={noop}
  />)

const mapStateToProps = state => ({
  isMapsReady: state.locale.isMapsReady,
})
export default connect(mapStateToProps)(Map)
