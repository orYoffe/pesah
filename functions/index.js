const path = require('path');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const Language = require('@google-cloud/language');
const express = require('express');


const app = express();
// const language = new Language({ projectId: process.env.GCLOUD_PROJECT });
admin.initializeApp(functions.config().firebase);


// exports.createProfile = functions.auth.user()
// .onCreate( event => {
//   console.log('event==onCreate== ', event);
//   const user = event.data;

//   return admin.database().ref(`/users/${user.uid}`).set({
//     creationTime: user.metadata.creationTime,
//     email: user.email,
//     uid: user.uid
//   });
// });

exports.removeUserFromDatabase = functions.auth.user()
.onDelete((event) => {
  let accountType;
  console.log('event==onDelete== ', event);

  // return admin.database().ref(`/users/${user.uid}/disabled`).set({
  //   creationTime: user.metadata.creationTime,
  //   email: user.email,
  //   uid: user.uid
  // });

  // //TODO delete user's access but keep user
  return admin.database().ref(`/users/${event.data.uid}/`)
  .then(user => {
    accountType = user.accountType;
    console.log('event==user== ', user);
    console.log('event==accountType== ', accountType);
    //   return user.remove()
    console.log('event==onDelete==Disabling user ', event);
    return user.child('disabled').set(true)
    // return
  })
    .then(() => accountType &&
    admin.database().ref(`/accountTypes/${event.data.uid}`).child('disabled').set(true))
});

exports.guard = functions.https.onRequest((req, res) => {
  console.log('guard req.hostname ========', req.hostname)
  if (req.body.a === 'pesah' || req.hostname === 'localhost') {
    res.sendFile(path.join(__dirname, 'realhtml_186231treg.html'));
  } else {
    res.redirect('https://earlybirdshopers.firebaseapp.com?a=wrong');
  }
});

exports.getArtists = functions.https.onRequest((req, res) => {
  if (req.query.coutry) { // TODO add params and options
    console.log('getArtists was called with country ===== ', req.query.coutry);
  } else {
    return admin.database().ref(`artists`).once("value").then(snapshot => {
      let artists = [];
      snapshot.forEach(function (childSnapshot) {
        const artist = childSnapshot.val();
        if (!artist.disabled && artist.uid) {
          artists.push(artist);
        }
        if (artists.length > 5) {
          return true;
        }
      });
      res.status(200).json(artists);
    })
  }
});

exports.getVenues = functions.https.onRequest((req, res) => {
  if (req.query.coutry) { // TODO add params and options
    console.log('getVenues was called with country ===== ', req.query.coutry);
  } else {
    return admin.database().ref(`venues`).once("value").then(snapshot => {
      let venues = [];
      snapshot.forEach(function (childSnapshot) {
        const venue = childSnapshot.val();
        if (!venue.disabled && venue.uid) {
          venues.push(venue);
        }
        if (venues.length > 5) {
          return true;
        }
      });
      res.status(200).json(venues);
    })
  }
});

exports.getFans = functions.https.onRequest((req, res) => {
  if (req.query.coutry) { // TODO add params and options
    console.log('getFans was called with country ===== ', req.query.coutry);
  } else {
    return admin.database().ref(`fans`).once("value").then(snapshot => {
      let fans = [];
      snapshot.forEach(function (childSnapshot) {
        const fan = childSnapshot.val();
        if (!fan.disabled && fan.uid) {
          fans.push(fan);
        }
        if (fans.length > 5) {
          return true;
        }
      });
      res.status(200).json(fans);
    })
  }
});

exports.getEvents = functions.https.onRequest((req, res) => {
  if (req.query.coutry) { // TODO add params and options
    console.log('getEvents was called with country ===== ', req.query.coutry);
  } else {
    return admin.database().ref(`events`).once("value").then(snapshot => {
      let events = [];
      snapshot.forEach(function (childSnapshot) {
        const event = childSnapshot.val();
        if (!event.disabled && event.uid) {
          events.push(event);
        }
        if (events.length > 5) {
          return true;
        }
      });
      res.status(200).json(events);
    })
  }
});

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

  console.log('authenticate req.headers=== ', req.headers)
  console.log('authenticate req.body=== ', req.body)
  console.log('authenticate req.user=== ', req.user)
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  return admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = decodedIdToken;
    console.log('authenticate === user============ ', req.user);
    next();
  }).catch(error => {
    console.log('authenticate req.error=== ', error)
    res.status(403).send('Unauthorized');
  });
};

app.use(authenticate);

app.post('/createEvent', (req, res) => {
  if (req.body.coutry) { // TODO add params and options
    console.log('createEvent was called with country ===== ', req.body.coutry);
  } else if (req.user && req.body && req.body.eventObject) {
    // return admin.database().ref(`events`)
    //   .push(req.body.eventObject)
    //   .then(newEvent => {
    //     // event id => newEvent.key

    //     return newEvent.child('uid').update(newEvent.key)
    //       // .then(snapshot => admin.database().ref.child(`${isArtist ? 'artists' : 'venues'}/${user.uid}/events${newEvent.key}`)
    //       // .set(newEvent.key)
    //       // .then(eventId => {
    //       //   debugger
    //       //   return newEvent
    //       // })
    //   })
  }
  console.log('createEvent req.headers=== ', req.headers)
  console.log('createEvent req.body=== ', req.body)
  console.log('createEvent req.user=== ', req.user)
  res.status(200)
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

// // Expose the API as a function
exports.api = functions.https.onRequest(app);

// // Helper function to categorize a sentiment score as positive, negative, or neutral
// const categorizeScore = score => {
//   if (score > 0.25) {
//     return 'positive';
//   } else if (score < -0.25) {
//     return 'negative';
//   }
//   return 'neutral';
// };
