const path = require('path');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Language = require('@google-cloud/language');
const express = require('express');


const app = express();
const language = new Language({ projectId: process.env.GCLOUD_PROJECT });
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

  //TODO delete user's access but keep user
  return admin.database().ref(`/users/${event.data.uid}`)
  .then(user => {
    accountType = user.accountType;
    console.log('event==user== ', user);
    console.log('event==accountType== ', accountType);
  //   return user.remove()
    return
  })
  // .then(() => accountType && admin.database().ref(`/users/${event.data.uid}`).remove());
});

exports.guard = functions.https.onRequest((req, res) => {
  if (req.body.a === 'pesah') {
    res.sendFile(path.join(__dirname, 'realhtml_186231treg.html'));
  } else {
    res.redirect('https://earlybirdshopers.firebaseapp.com?a=wrong');
  }
});
