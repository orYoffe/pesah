const path = require('path');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const events = require('./modules/events');
const api = require('./api');

admin.initializeApp(functions.config().firebase);

exports.disableUser = events.disableUser
// exports.createRoom = events.createRoom

exports.guard = functions.https.onRequest((req, res) => {
  if (req.body.a === 'pesah') {
    res.sendFile(path.join(__dirname, 'realhtml_186231treg.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Expose the API as a function
exports.api = functions.https.onRequest(api.default);