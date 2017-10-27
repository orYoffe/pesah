import { auth, createEvent as createEventPost } from '../firebase'
import { verifyEmail } from '../auth'

const defaultPayment = {
    uid: 0,
    email: '',
    status: 'initial',
    token: null,
    cancelled: false,
    users: {},
}

export const createEvent = (eventData) => {

    const user = auth().currentUser
    const {
        title,
        date,
        time,
        price,
        goal,
        currency,
        location,
        venue,
        artist,
        photoURL,
        accountType,
    } = eventData
    const isArtist = accountType === 'artist'
    const isVenue = accountType === 'venue' 
    
    if (!user || !user.uid || (!isArtist && !isVenue)) {
        // TODO validate location and date and time goal price and everything else also image
        return 'login'
    }
    if (!user.emailVerified) {
        verifyEmail()
        return 'verifyemail'
    }
    const country = location.address_components
        .find(prop => prop.types.indexOf('country') !== -1).long_name
    const countryShortName = location.address_components
        .find(prop => prop.types.indexOf('country') !== -1).short_name
    const city = location.address_components
        .find(prop => prop.types.indexOf('locality') !== -1).long_name

    if (!country || !countryShortName || !city || !location.formatted_address) {
        return 'location'
    }
    
    // TODO add validation
    
    const eventTime = new Date(date)
    const [hours, minutes] = time.split(':')
    eventTime.setHours(hours)
    eventTime.setMinutes(minutes)
    
    return createEventPost({ eventObject: {
        eventTime: eventTime.toJSON(),
        city: city,
        countryShortName: countryShortName,
        country: country,
        title,
        date,
        time,
        price,
        goal,
        currency,
        venue,
        artist,
        photoURL,
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng(),
        formatted_address: location.formatted_address,
     } }, (...rest) => {
        console.log('rest--------post event ===', rest)
        return rest
    }).catch(err => {
        console.log('err--------post event ===', err)
    })


}

const createPayment = (paymentData) => {
     const user = auth().currentUser

     if (!user || !user.uid || !paymentData || !paymentData.eventId) {
         return ''
     }

    // TODO make sure user and payment are verified
    //  if (!user.emailVerified) {
        //      verifyEmail()
        //      return 'verifyemail'
        //  }

    // TODO add validation

    const paymentObject = {
        ...defaultPayment,
        ...paymentData
    }
     // TODO make account type (artist/venue) dynamic

     // TODO save payment to event, payments and user
    //  ref.child(`artists/${user.uid}/payments`)
    //     .push(paymentObject)
    //     .then(newPayment => {
            // payment id => newPayment.key
        // })
}

export default {
    createEvent,
    createPayment,
    update: {},
    remove: {},
    get: {}
}
