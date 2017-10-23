import { ref, auth, getUser, req } from '../firebase'
import { verifyEmail } from '../auth'

const defaultEvent = {
    fans: {},
    payments: {},
    currency: {},
    dates: {
        created: null,
        eventTime: null,
        auctionStart: null,
        auctionEnd: null,
        end: null
    },
    goalPrice: {},
    priceStatus: {},
    ticketPrice: 0,
    title: '',
    object: 'event',
    email: '',
    eventVerified: false,
    photoURL: '',
    uid: 0,
    artists: {},
    venues: {},
    managers: {},
    isPartOfTour: false,
    futureEvents: {},
    pastEvents: {},
    claimed: false,
    location: {},
    collaborationPartners: {
        venues: {},
        artists: {}
    },
}

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
    

    const country = location.address_components
        .find(prop => prop.types.indexOf('country') !== -1).long_name
    const countryShortName = location.address_components
        .find(prop => prop.types.indexOf('country') !== -1).short_name
    const city = location.address_components
        .find(prop => prop.types.indexOf('locality') !== -1).long_name
    
    const eventTime = new Date(date)
    const [hours, minutes] = time.split(':')
    eventTime.setHours(hours)
    eventTime.setMinutes(minutes)

    const eventObject = {
        ...defaultEvent,
        dates: {
            created: new Date().toJSON(),
            eventTime,
            auctionStart: null, // TODO custom campagins
            auctionEnd: eventTime, // TODO custom campagins
        },
        fans: {},
        payments: {},
        owner: {
            accountType,
            uid: user.uid,
            email: user.email,
        },
        currency: {
            symbol: currency,
            country,
        },
        goalPrice: goal,
        priceStatus: {
            level: 0,
            precentage: 0,
        },
        ticketPrice:price,
        title,
        object: 'event',
        eventVerified: false,
        photoURL,
        uid: 0,
        artists: {
            isOwner: isArtist,
            [artist]: artist || null, // TODO add real api artist data
        },
        venues: {
            isOwner: isVenue,
            [venue]: venue|| null, // TODO implement real data venues
        },
        managers: {
            // implement premissions to venue and artists in the event
        },
        isPartOfTour: false, // TODO add tour functionality
        futureEvents: {}, // TODO as part of a tour feature
        pastEvents: {}, // TODO as part of a tour feature
        venueApproved: isVenue, // if venue approved 
        artistApproved: isArtist, // if venue approved 
        location: {
            country,
            countryShortName, 
            city,
        },
        collaborationPartners: {
            venues: {}, // TOTO aother venues and artists adding
            artists: {},
        },
    }

    // TODO make sure user and event are verified
    //  if (!user.emailVerified) {
    //     verifyEmail()
    //     return 'verifyemail'
    // }

    // TODO add validation


     // TODO list:
     // create event
     // connect to artist and venue if exists
     // check id event or ATcvRIST
    return req('POST', 'createEvent', { eventObject }, (...rest) => {
        console.log('rest--------post event ===', rest)
        return rest
    })

    // return ref.child(`events`)
    // .push(eventObject)
    // .then(newEvent => {
    //     debugger
    //     // event id => newEvent.key
    //     return ref.child(`${isArtist ? 'artists' : 'venues'}/${user.uid}/events${newEvent.key}`)
    //         .set(newEvent.key)
    //         .then(eventId => {
    //             debugger
    //             return newEvent
    //         })
    // })
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
