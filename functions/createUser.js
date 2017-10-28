const admin = require('firebase-admin');
const common = require('./common');

const accountTypes = ['artist', 'venue', 'fan'];

const createUser = (req, res) => {
    console.log('createUser--------was called===', new Date())
    if (
        req.body && req.body.displayName &&
        req.body.accountType && accountTypes.includes(req.body.accountType) &&
        req.body.uid && req.body.uid === req.user.uid
    ) {
        // TODO validate user given strings check for special chars
        if (!common.isString(req.body.displayName) || req.body.displayName.length < 4) {
            console.log('displayName is wrong');
            return res.status(400).json({ errorCode: 400, errorMessage: 'displayName' });
        }
        if (!common.isString(req.body.accountType) || !accountTypes.includes(req.body.accountType)) {
            console.log('accountType is wrong');
            return res.status(400).json({ errorCode: 400, errorMessage: 'accountType' });
        }
        return admin.database().ref(`users/${req.user.uid}`).once('value', snapshot => {
            const user = snapshot.val();
            console.log('createUser-------- == snapshot.val()=user==', user)
            // const event = req.body.eventObject;

            if (user) {
                console.log('user exists');
                return res.status(400).json({ errorCode: 400, errorMessage: 'user exists' });
            }

            // TODO add validations

            // TODO add user to users and accountType objects with name and type

            const creationTime = new Date().toJSON();
            return admin.database().ref(`/users/${req.user.uid}`).set({
                creationTime: creationTime,
                email: req.user.email,
                rooms: {},
                uid: req.user.uid,
                displayName: req.body.displayName,
                accountType: req.body.accountType
            })
            .then(() => {
                return admin.database().ref(`/${req.body.accountType}s/${req.user.uid}`).set({
                    creationTime: creationTime,
                    uid: req.user.uid,
                    displayName: req.body.displayName,
                    accountType: req.body.accountType
                }).then(() => {

                    return res.status(200).json({ code: 200, message: 'ok', user: {
                        uid: req.user.uid,
                    } });
                });
            });
        });
    } else {
        res.status(400).send('Bad request body');
    }
};

exports.default = createUser;