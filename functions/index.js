const path = require('path');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const events = require('./events.js');
const api = require('./api.js');

admin.initializeApp(functions.config().firebase);

exports.disableUser = events.disableUser
exports.createRoom = events.createRoom

exports.guard = functions.https.onRequest((req, res) => {
  if (req.body.a === 'pesah') {
    res.sendFile(path.join(__dirname, 'realhtml_186231treg.html'));
  } else {
    res.redirect('https://earlybirdshopers.firebaseapp.com?a=wrong');
  }
});

// Expose the API as a function
exports.api = functions.https.onRequest(api.default);