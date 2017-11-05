const admin = require('firebase-admin');
const common = require('../common');


const createBookingRequest = (req, res) => {
    console.log('createBookingRequest was called ===== ', new Date().toJSON());
    // TODO validate user given strings
    if (!req.body || !req.body.venueId || !common.isString(req.body.venueId)) {
        return res.status(400).send('venueId');
    }
    // TODO uncomment the email validation
    // if (!req.user.email_verified) {
    //     return res.status(400).json({ errorCode: 400, errorMessage: 'email' });
    // }
    return admin.database().ref(`artists/${req.user.uid}`).once("value").then(snapshot => {
        const artist = snapshot && snapshot.val();

        if (!artist || artist.accountType !== 'artist') {
            return res.status(400).json({ errorCode: 400, errorMessage: 'accountType' });
        }
        // TODO add validations

        return admin.database().ref(`users/${req.body.venueId}`).once("value")
        .then(snapshot => {
            const venue = snapshot && snapshot.val();
            if (!venue) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'venue' });
            }
            if (venue.accountType !== 'venue') {
                return res.status(400).json({ errorCode: 400, errorMessage: 'venue type' });
            }
            if (venue.bookingRequests && venue.bookingRequests[artist.uid]) {
                return res.status(400).json({ errorCode: 400, errorMessage: 'already exists' });
            }

            const newBookingRequest = {
                uid: artist.uid,
                email: req.user.email,
                displayName: artist.displayName || artist.name,
                timeCreate: new Date().toJSON()
            };

            if (req.body.requestMessage && common.isString(req.body.requestMessage)) {
                newBookingRequest.message = req.body.requestMessage.trim();
            }
            console.log('new bookingRequest--------------', newBookingRequest);
            return admin.database().ref(`users/${req.body.venueId}/bookingRequests/${artist.uid}`).set(newBookingRequest)
                .then(newBook => res.status(200).json({ code: 200, message: 'ok' }))
                .catch(err => res.status(400).json({ errorCode: 400, errorMessage: err }));
        });
    });
};

const decideBookingRequest = (isApproved) => (req, res) => {
    console.log('declineBookingRequest was called ===== ', new Date().toJSON());
    // TODO validate user given strings
    if (!req.body || !req.body.artistId || !common.isString(req.body.artistId)) {
        return res.status(400).send('artistId');
    }
    // if (req.user.uid !== req.body.artistId) {
    //     return res.status(400).send('user');
    // }
    // TODO uncomment the email validation
    // if (!req.user.email_verified) {
    //     return res.status(400).json({ errorCode: 400, errorMessage: 'email' });
    // }
        // TODO add validations

    return admin.database().ref(`users/${req.user.uid}`).once("value")
    .then(snapshot => {
        const venue = snapshot && snapshot.val();
        console.log('venue ==============================  ', venue)
        if (!venue) {
            return res.status(400).json({ errorCode: 400, errorMessage: 'venue' });
        }
        if (!venue || venue.accountType !== 'venue') {
            return res.status(400).json({ errorCode: 400, errorMessage: 'venue' });
        }
        if (!venue.bookingRequests || !venue.bookingRequests[req.body.artistId]) {
            return res.status(400).json({ errorCode: 400, errorMessage: 'doesn\'t exists' });
        }
        const answer = { isApproved: !!isApproved, isDeclined: !isApproved }
        const newBookingAnswer = {
            uid: venue.uid,
            displayName: venue.displayName || venue.name || req.user.displayName,
            timeCreate: new Date().toJSON(),
            isApproved: !!isApproved,
            isDeclined: !isApproved,
        };
        if (req.body.answerMessage && common.isString(req.body.answerMessage)) {
            newBookingAnswer.message = req.body.answerMessage.trim();
        }

        console.log('new booking Answer--------------', newBookingAnswer);
        return admin.database().ref(`users/${venue.uid}/bookingRequests/${req.body.artistId}`)
        .update(answer)
        .then(() => admin.database().ref(`users/${req.body.artistId}/bookingAnswers/${venue.uid}`).set(newBookingAnswer)
        .then(newBook => res.status(200).json({ code: 200, message: 'ok' })))
        .catch(err => res.status(400).json({ errorCode: 400, errorMessage: err }));
    });
};

exports.createBookingRequest = createBookingRequest;
exports.declineBookingRequest = decideBookingRequest();
exports.approveBookingRequest = decideBookingRequest(true);