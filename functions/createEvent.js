const admin = require('firebase-admin');
const common = require('./common');


const createEvent = (req, res) => {
    console.log('createEvent was called ===== ', new Date().toJSON());
        // TODO validate user given strings
    if (req.body && req.body.eventObject) {
        if (!req.user.email_verified) {
            return res.status(400).json({ errorCode: 400, errorMessage: 'email' });
        }
        return admin.database().ref(`users/${req.user.uid}`).once("value").then(snapshot => {
            const user = snapshot.val();
            const event = req.body.eventObject;

            const isArtist = user.accountType === 'artist'
            const isVenue = user.accountType === 'venue'

            if (!isArtist && !isVenue) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'account' });
            }
            if (isNaN(Date.parse(event.eventTime))) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'eventTime' });
            }
            if (!common.isNumber(event.goal)) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'goal' });
            }
            if (!common.isNumber(event.price)) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'price' });
            }
            if (!common.isString(event.title) || event.title.length < 4) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'title' });
            }
            if (!common.isString(event.city) || !common.isString(event.country) || !common.isString(event.formatted_address) || !common.isString(event.countryShortName)
                || !common.isNumber(event.lat) || !common.isNumber(event.lng)) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'location' });
            }
            if (!common.isString(event.currency) || (event.currency !== '$' && event.currency !== '₪')) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'currency' });
            }
            if (!common.isString(event.venue) || event.venue.length < 4) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'venue' });
            }
            if (!common.isString(event.artist) || event.artist.length < 4) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'artist' });
            }

            // TODO add validations

            const newEvent = {
                fans: {},
                payments: {},
                currency: {
                    symbol: event.currency,
                    name: event.currency === '$' ? 'USD' : 'ILS'
                },
                artists: {
                    // TODO add artist
                },
                venues: {
                    // TODO add venue
                },
                date: {
                    created: new Date().toJSON(),
                    eventTime: event.eventTime,
                    auctionStart: null,
                    auctionEnd: null,
                    end: null
                },
                goalPrice: event.goal,
                ticketPrice: event.price,
                title: event.title,
                verified: false,
                managers: {},
                location: {
                    country: event.country,
                    city: event.city,
                    short: event.countryShortName,
                    address: event.formatted_address,
                    lat: event.lat,
                    lng: event.lng
                },
                collaboration: {
                    artists: {},
                    venues: {},
                    fans: {}
                },
                description: common.isString(event.description) ? event.description : '',
                fundStatus: {
                    fundsRaised: 0,
                    precentage: 0,
                },
                page: {
                    cover: common.isString(event.photoURL) ? event.photoURL : ''
                },
                venueVerified: false,
                artistVerified: false,
                cancelled: false,
                funded: false
            };
            newEvent.managers[req.user.uid] = {
                uid: req.user.uid,
                email: req.user.email,
                accountType: user.accountType
            }
            if (isArtist) {
                newEvent.artists[req.user.uid] = {
                    uid: req.user.uid,
                    email: req.user.email,
                    accountType: user.accountType
                }
                newEvent.venues[event.venue] = {
                    email: event.venue,
                    accountType: 'venue'
                }
            } else {
                newEvent.venues[req.user.uid] = {
                    uid: req.user.uid,
                    email: req.user.email,
                    accountType: user.accountType
                }
                newEvent.artists[event.artist] = {
                    email: event.artist,
                    accountType: 'artist'
                }

            }

            console.log('newEvent--------------', newEvent);
            return admin.database().ref(`events`)
                .push(newEvent)
                .then(newDBEvent => {
                    // event id => newDBEvent.key
                    res.status(200).json(newDBEvent);
                    return newDBEvent.update({ 'uid': newDBEvent.key })
                        .then(snapshot => admin.database().ref(`${isArtist ? 'artists' : 'venues'}/${user.uid}/events/${newDBEvent.key}`)
                            .set({ uid: newDBEvent.key })
                            .then(eventId => {
                                // TODO add venue update if it is a user
                                return newDBEvent
                            }))
                });
        });
    } else {
        res.status(400).send('eventObject');
    }
};

exports.default = createEvent;