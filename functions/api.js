

// const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const express = require('express');
const cookieParser = require('cookie-parser')();
const createEvent = require('./modules/createEvent');
const createUser = require('./modules/createUser');
const getRoom = require('./modules/getRoom');
const getters = require('./modules/getters');
const adminApis = require('./modules/admin');
const booking = require('./modules/booking');

const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = (req, res, next) => {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !req.cookies.__session) {
        console.error('No ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <ID Token>',
        'or by passing a "__session" cookie.');
        res.status(401).send('Unauthorized');
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    }
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        console.log('ID Token correctly decoded');//, decodedIdToken);
        req.user = decodedIdToken;
        next();
    }).catch(error => {
        console.error('Error while verifying ID token:', error);
        res.status(401).send('Unauthorized');
    });
};
const adminAuthenticate = (req, res, next) => {
    if (req.user && req.user.uid) {
        admin.database().ref(`admins/${req.user.uid}`).once("value").then(snapshot => {
            if (snapshot && snapshot.val()) {
                req.user.isAdmin = true;
                next();
            } else {
                res.status(401).send('Unauthorized');
            }
        });
    } else {
        res.status(401).send('Unauthorized');
    }
};

app.options('*', cors); // include before other routes
app.use(cors);
app.use(cookieParser);

app.get('/getArtists', getters.getArtists);

app.get('/getVenues', getters.getVenues);

app.get('/getFans', getters.getFans);

app.get('/getEvents', getters.getEvents);

app.get('/explore', getters.explore);

app.use(authenticate);

app.post('/createEvent', createEvent.default);
app.post('/createUser', createUser.default);
app.post('/getRoom', getRoom.default);
app.post('/sendBookingRequest', booking.createBookingRequest);
app.post('/approveBookingRequest', booking.approveBookingRequest);
app.post('/declineBookingRequest', booking.declineBookingRequest);

// Admin api
app.use(adminAuthenticate);
app.post('/createNonUserVenue', adminApis.adminCreateVenue);
app.post('/updateNonUserVenue', adminApis.adminUpdateVenue);

const notFound = (req, res) => {
    res.status(404).send('Not Found');
};

app.use(notFound);

exports.default = app;
