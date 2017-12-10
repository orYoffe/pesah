import React from 'react'
import { connect } from 'react-redux'
import noop from 'lodash/noop'
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps'

const Gmap = withGoogleMap(({
  markers,
  onMapLoad,
  onMapClick,
  onMarkerRightClick,
  defaultCenter
}) => (
  <GoogleMap
    ref={onMapLoad}
    defaultZoom={11}
    defaultCenter={markers.length === 1 ? markers[0].position : defaultCenter || { lat: 32.111767, lng: 34.801361 }}
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
  defaultCenter
}) => (
    isMapsReady && <Gmap
    containerElement={
      <div style={{ height: `100%`, minHeight: '200px' }} />
    }
    mapElement={
      <div style={{ height: `100%`, minHeight: '200px' }} />
    }
    defaultCenter={defaultCenter}
    onMapLoad={noop}
    onMapClick={noop}
    markers={markers}
    onMarkerRightClick={noop}
  />)

const mapStateToProps = state => ({
  isMapsReady: state.locale.isMapsReady,
})
export default connect(mapStateToProps)(Map)
