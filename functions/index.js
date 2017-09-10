const functions = require('firebase-functions');

exports.guard = functions.https.onRequest((req, res) => {
  if (req.query.a === 'pesah') {
    res.redirect("https://earlybirdshopers.firebaseapp.com/realhtml_186231treg.html?a=pesah");
  } else {
    res.redirect('https://earlybirdshopers.firebaseapp.com?a=wrong');
  }
});
