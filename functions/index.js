const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.createProfile = functions.auth.user()
.onCreate( event => {
  console.log('event==onCreate== ', event);
  const user = event.data;

  return admin.database().ref(`/users/${user.uid}`).set({
    creationTime: user.metadata.creationTime,
    email: user.email,
    uid: user.uid
  });
});

exports.removeUserFromDatabase = functions.auth.user()
.onDelete((event) => {
  console.log('event==onDelete== ', event);
  return admin.database().ref(`/users/${event.data.uid}`).remove();
});

exports.guard = functions.https.onRequest((req, res) => {
  if (req.query.a === 'pesah') {
    res.redirect("https://earlybirdshopers.firebaseapp.com/realhtml_186231treg.html?a=pesah");
  } else {
    res.redirect('https://earlybirdshopers.firebaseapp.com?a=wrong');
  }
});
