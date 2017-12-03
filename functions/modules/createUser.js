const admin = require('firebase-admin');
const common = require('../common');

const accountTypes = ['musician', 'venueManager'];

const createUser = (req, res) => {
    console.log('createUser--------was called===', new Date(), req.body)
    if (
        req.body && req.body.displayName &&
        req.body.accountType && accountTypes.includes(req.body.accountType) &&
        req.body.uid && req.body.uid === req.user.uid &&
        req.body.accountType === 'venueManager' // TODO fix venueManager signup process
    ) {
        return res.status(400).send('Bad request body');
    }

    // TODO validate user given strings check for special chars
    if (!common.isString(req.body.displayName) || req.body.displayName.length < 2) {
        console.log('displayName is wrong');
        return res.status(400).json({ errorCode: 400, errorMessage: 'displayName' });
    }
    if (!common.isString(req.body.firstname) || req.body.firstname.length < 2) {
        console.log('firstname is wrong');
        return res.status(400).json({ errorCode: 400, errorMessage: 'firstname' });
    }
    if (!common.isString(req.body.lastname) || req.body.lastname.length < 2) {
        console.log('lastname is wrong');
        return res.status(400).json({ errorCode: 400, errorMessage: 'lastname' });
    }
    if (!common.isString(req.body.accountType) || !accountTypes.includes(req.body.accountType)) {
        console.log('accountType is wrong');
        return res.status(400).json({ errorCode: 400, errorMessage: 'accountType' });
    }
    return admin.database().ref(`users/${req.user.uid}`).once('value', snapshot => {
        const user = snapshot.val();
        console.log('createUser-------- == snapshot.val()=user==', user)

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
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            displayName: req.body.displayName,
            accountType: req.body.accountType
        })
        .then(() => {
            return admin.database().ref(`/${req.body.accountType}s/${req.user.uid}`).set({
                creationTime: creationTime,
                uid: req.user.uid,
                displayName: req.body.displayName,
                name: req.body.displayName,
                accountType: req.body.accountType
            }).then(() => {

                return res.status(200).json({ code: 200, message: 'ok', user: {
                    uid: req.user.uid,
                } });
            });
        });
    });
};

exports.default = createUser;
