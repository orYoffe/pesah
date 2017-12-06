const admin = require('firebase-admin');
const common = require('../common');

const accountTypes = ['musician', 'venueManager'];
const checkVenueUrl = (name) => new Promise((resolve, reject) => {
    return admin.database().ref(`venues`).orderByChild('profileUrl').equalTo(name).once('value', (snapshot) => {
        if (snapshot.val() === null) {
            // url not taken
            resolve(true)
        } else {
            // url taken
            resolve(false)
        }
    });
});


const createUser = (req, res) => {
    console.log('createUser--------was called===', new Date(), req.body);
    if (!req.body) {
        return res.status(400).json({ errorCode: 400, errorMessage: 'body' });
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
    if (req.body.accountType === 'venueManager') {
        if (
            !req.body.location ||
            !req.body.location.city ||
            !req.body.location.country ||
            !req.body.location.countryShortName ||
            !req.body.location.address ||
            !req.body.location.lat ||
            !req.body.location.lng
        ) {
            console.log('location is wrong');
            return res.status(400).json({ errorCode: 400, errorMessage: 'location' });
        }

        if (!common.isNumber(req.body.seatingCapacity)) {
            console.log('seatingCapacity is wrong');
            return res.status(400).json({ errorCode: 400, errorMessage: 'seatingCapacity' });
        }
        if (!common.isNumber(req.body.standingCapacity)) {
            console.log('standingCapacity is wrong');
            return res.status(400).json({ errorCode: 400, errorMessage: 'standingCapacity' });
        }
        if (!req.body.profileUrl || !common.isString(req.body.profileUrl) || req.body.profileUrl.trim().replace(/ /g, '_').replace(/[^\w\s]/gi, '').length < 1) {
            console.log('profileUrl is wrong======', req.body.profileUrl, '=====');
            return res.status(400).json({ errorCode: 400, errorMessage: 'profileUrl' });
        }
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
        let accountType = req.body.accountType;
        const creationTime = new Date().toJSON();
        const newUser = {
            creationTime: creationTime,
            email: req.user.email,
            rooms: {},
            uid: req.user.uid,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            displayName: req.body.displayName,
            accountType: req.body.accountType,
        };
        const newEntity = {
            creationTime: creationTime,
            uid: req.user.uid,
            displayName: req.body.displayName,
            name: req.body.displayName,
            accountType: req.body.accountType
        };
        const profileUrl = req.body.profileUrl.trim().replace(/ /g, '_').replace(/[^\w\s]/gi, '');
        if (accountType === 'venueManager') {
            newUser.location = req.body.location;
            newUser.seatingCapacity = req.body.seatingCapacity;
            newUser.standingCapacity = req.body.standingCapacity;
            newUser.profileUrl = profileUrl;

            newEntity.location = req.body.location;

            Object.keys(newEntity.location).forEach(key => {
                if (!newEntity.location[key] && newEntity.location[key] !== false) {
                    delete newEntity.location[key];
                }
            });
            delete newEntity.uid;
            newEntity.seatingCapacity = req.body.seatingCapacity;
            newEntity.standingCapacity = req.body.standingCapacity;
            newEntity.profileUrl = profileUrl;
            newEntity.accountType = 'venue';
            newEntity.managers = {};
            newEntity.managers[req.user.uid] = {
                creationTime: creationTime,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                accountType: req.body.accountType,
                uid: req.user.uid
            };
            return checkVenueUrl(newEntity.profileUrl).then((isUrlFree) => {
                if (!isUrlFree) {
                    console.log('profileUrl exists');
                    return res.status(400).json({ errorCode: 400, errorMessage: 'profileUrl exists' });
                }
                return admin.database().ref(`venues`)
                .push(newEntity)
                .then(newVenue => {
                    console.log('---------new venue ----', newVenue);
                    return newVenue.update({ 'uid': newVenue.key })
                    .then(snapshot => {
                        newUser.venues = {};
                        newEntity.uid = newVenue.key;
                        newUser.venues[newVenue.key] = newEntity;
                        console.log('------saving new user ----', newUser);
                        return admin.database().ref(`/users/${req.user.uid}`).set(newUser)
                        .then((response) => {
                            console.log('------response--end-----', response);
                            res.status(200).json({ code: 200, message: 'ok', user: {
                                uid: req.user.uid,
                            }});
                        });
                    });
                });
            });
        } else {
            return admin.database().ref(`/users/${req.user.uid}`).set(newUser)
            .then(() => {
                return admin.database().ref(`/${accountType}s/${req.user.uid}`).set(newEntity)
                .then(() => {

                    return res.status(200).json({ code: 200, message: 'ok', user: {
                        uid: req.user.uid,
                    } });
                });
            });
        }
    });
};

exports.default = createUser;
