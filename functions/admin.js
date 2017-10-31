const admin = require('firebase-admin');
const common = require('./common');


const adminEndpoint = (req, res) => {
    console.log('admin was called ===== ', new Date().toJSON());
    // TODO validate user given strings
    if (req.body && req.body.eventObject) {
        if (!req.user.isAdmin) {
            return res.status(400).json({ errorCode: 400, errorMessage: 'email' });
        }
        // return admin.database().ref(`users/${req.user.uid}`).once("value").then(snapshot => {
        // });
    }
};

exports.default = adminEndpoint;