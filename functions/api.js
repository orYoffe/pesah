

// const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const cors = require('cors')({ origin: true });
const cors = require('cors')();
const express = require('express');
const cookieParser = require('cookie-parser')();


const app = express();

// exports.createEvent = functions.database.ref('/events/{pushId}')
//   .onWrite(event => {
//     // Grab the current value of what was written to the Realtime Database.
//     const original = event.data.val();
//     console.log('createEvent =====', event.params.pushId, original);
//     // const uppercase = original.toUpperCase();
//     // You must return a Promise when performing asynchronous tasks inside a Functions such as
//     // writing to the Firebase Realtime Database.
//     // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//     // return event.data.ref.parent.child('uppercase').set(uppercase);
//   });

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
app.options('*', cors) // include before other routes 
app.use(cors);
app.use(cookieParser);
app.use(authenticate);

app.post('/createEvent', (req, res) => {
    if (req.body && req.body.eventObject) {
        if (!req.user.email_verified) {
            console.log('-----------not email_verified---------------')
            return res.status(400).json({ errorCode: 400, errorMessage: 'email' });
            // return
        }
        console.log('-----------email_verified---------------')
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
          description: event.description || '',
          fundStatus: {
            fundsRaised: 0,
            precentage: 0,
          },
          page: {
            cover: event.photoURL
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
                return newDBEvent.update({'uid': newDBEvent.key})
                .then(snapshot => admin.database().ref(`${isArtist ? 'artists' : 'venues'}/${user.uid}/events/${newDBEvent.key}`)
                .set({uid: newDBEvent.key})
                .then(eventId => {
                    // TODO add venue update if it is a user
                return newDBEvent
              }))
          });
        });
    } else {
        res.status(400).send('eventObject');
    }
});


// // POST /api/messages
// // Create a new message, get its sentiment using Google Cloud NLP,
// // and categorize the sentiment before saving.
// app.post('/messages', (req, res) => {
//   const message = req.body.message;

//   language.detectSentiment(message).then(results => {
//     const category = categorizeScore(results[0].score);
//     const data = { message: message, sentiment: results, category: category };
//     return admin.database().ref(`/users/${req.user.uid}/messages`).push(data);
//   }).then(snapshot => {
//     return snapshot.ref.once('value');
//   }).then(snapshot => {
//     const val = snapshot.val();
//     res.status(201).json({ message: val.message, category: val.category });
//   }).catch(error => {
//     console.log('Error detecting sentiment or saving message', error.message);
//     res.sendStatus(500);
//   });
// });

// // GET /api/messages?category={category}
// // Get all messages, optionally specifying a category to filter on
// app.get('/messages', (req, res) => {
//   const category = req.query.category;
//   let query = admin.database().ref(`/users/${req.user.uid}/messages`);

//   if (category && ['positive', 'negative', 'neutral'].indexOf(category) > -1) {
//     // Update the query with the valid category
//     query = query.orderByChild('category').equalTo(category);
//   } else if (category) {
//     return res.status(404).json({ errorCode: 404, errorMessage: `category '${category}' not found` });
//   }

//   query.once('value').then(snapshot => {
//     var messages = [];
//     snapshot.forEach(childSnapshot => {
//       messages.push({ key: childSnapshot.key, message: childSnapshot.val().message });
//     });

//     return res.status(200).json(messages);
//   }).catch(error => {
//     console.log('Error getting messages', error.message);
//     res.sendStatus(500);
//   });
// });

// // GET /api/message/{messageId}
// // Get details about a message
// app.get('/message/:messageId', (req, res) => {
//   const messageId = req.params.messageId;
//   admin.database().ref(`/users/${req.user.uid}/messages/${messageId}`).once('value').then(snapshot => {
//     if (snapshot.val() !== null) {
//       // Cache details in the browser for 5 minutes
//       res.set('Cache-Control', 'private, max-age=300');
//       res.status(200).json(snapshot.val());
//     } else {
//       res.status(404).json({ errorCode: 404, errorMessage: `message '${messageId}' not found` });
//     }
//   }).catch(error => {
//     console.log('Error getting message details', messageId, error.message);
//     res.sendStatus(500);
//   });
// });


// // Helper function to categorize a sentiment score as positive, negative, or neutral
// const categorizeScore = score => {
//   if (score > 0.25) {
//     return 'positive';
//   } else if (score < -0.25) {
//     return 'negative';
//   }
//   return 'neutral';
// };
const notFound = (req, res) => {
    res.status(404).send('Not Found');
};

app.use(notFound);

exports.default = app;