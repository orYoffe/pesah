import { ref, auth } from '../firebase'
import { verifyEmail } from '../auth'


const defaultEvent = {
    fans: {},
    payments: {},
    currency: {},
    dates: {
        created: null,
        start: null,
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

const createEvent = (eventData) => {
     const user = auth().currentUser

     if (!user || !user.uid) {
         return ''
     }

    // TODO make sure user and event are verified
    //  if (!user.emailVerified) {
        //      verifyEmail()
        //      return 'verifyemail'
        //  }

    // TODO add validation

    const eventObject = {
        ...defaultEvent,
        ...eventData
    }
     // TODO make account type (artist/venue) dynamic
     ref.child(`events`)
        .push(eventObject)
        .then(newEvent => {
            // event id => newEvent.key
            return ref.child(`artists/${user.uid}/events`)
            .push(newEvent.key)
            .then(newEvent => {
                // event id => newEvent.key
            })
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

const eventActions = {
    createEvent,
    createPayment,
    update: {},
    remove: {},
    get: {}
}

export default eventActions
