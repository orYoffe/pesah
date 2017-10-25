const path = require('path');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const Language = require('@google-cloud/language');
// const express = require('express');
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
  if (req.body.a === 'pesah') {
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

// // Expose the API as a function
const app = require('./api.js');
exports.api = functions.https.onRequest(app.default);