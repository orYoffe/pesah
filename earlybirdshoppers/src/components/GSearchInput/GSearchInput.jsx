import React from 'react'
import PropTypes from 'prop-types'
// import { compose, withProps, lifecycle } from 'recompose'
// import {
//     withScriptjs,
// } from 'react-google-maps'
import StandaloneSearchBox from 'react-google-maps/lib/components/places/StandaloneSearchBox'
// import Loader from '../Loader/'
import { stopPropogation } from '../../helpers/common'

const GSearchInput = props => (
    <div data-standalone-searchbox="">
        <StandaloneSearchBox
            ref={props.refrence}
            onPlacesChanged={props.onPlacesChanged}
        >
            <input
                type="text"
                placeholder={props.placeholder}
                className={props.className}
                id={props.id}
                onKeyDown={stopPropogation}
            />
        </StandaloneSearchBox>
        {/*<ol className="hidden">
            {props.places.map(({ place_id, formatted_address, geometry: { location } }) =>
                <li key={place_id}>
                    {formatted_address}
                    {" at "}
                    ({location.lat()}, {location.lng()})
                </li>
            )}
        </ol>*/}
    </div>
)
     

GSearchInput.proptypes = {
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    refrence: PropTypes.func.isRequired,
    onPlacesChanged: PropTypes.func.isRequired,
}

// export default compose(
//     withProps({
//         // googleMapURL: 'https://maps.googleapis.com/maps/api/js?v=3.28&libraries=places,geometry,drawing,places&key=AIzaSyBb-v3zujUJ9ZS4T7Inbo6pRHetDpRen3g',
//         loadingElement: <Loader />,
//     }),
// )(GSearchInput)
export default GSearchInput