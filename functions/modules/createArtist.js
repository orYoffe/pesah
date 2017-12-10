const admin = require('firebase-admin');
const common = require('../common');

const checkArtistUrl = (name) => new Promise((resolve, reject) => {
    return admin.database().ref(`artists`).orderByChild('profileUrl').equalTo(name).once('value', (snapshot) => {
        if (snapshot.val() === null) {
            // url not taken
            resolve(true)
        } else {
            // url taken
            resolve(false)
        }
    });
});


const createArtist = (req, res) => {
    console.log('createArtist--------was called===', new Date(), req.body);
    if (!req.body) {
        return res.status(400).json({ errorCode: 400, errorMessage: 'body' });
    }

    // TODO validate user given strings check for special chars
    if (!common.isString(req.body.title) || req.body.title.length < 2) {
        console.log('title is wrong');
        return res.status(400).json({ errorCode: 400, errorMessage: 'title' });
    }
    if (!common.isString(req.body.description) || req.body.description.length < 2) {
        console.log('description is wrong');
        return res.status(400).json({ errorCode: 400, errorMessage: 'description' });
    }
    if (!common.isString(req.body.style) || req.body.style.length < 2) {
        console.log('style is wrong');
        return res.status(400).json({ errorCode: 400, errorMessage: 'style' });
    }
    if (!common.isString(req.body.genre) || req.body.genre.length < 2) {
        console.log('genre is wrong');
        return res.status(400).json({ errorCode: 400, errorMessage: 'genre' });
    }
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
    if (!req.body.profileUrl || !common.isString(req.body.profileUrl) || req.body.profileUrl.trim().replace(/ /g, '_').replace(/[^\w\s]/gi, '').length < 1) {
        console.log('profileUrl is wrong======', req.body.profileUrl, '=====');
        return res.status(400).json({ errorCode: 400, errorMessage: 'profileUrl' });
    }
    return admin.database().ref(`users/${req.user.uid}`).once('value', snapshot => {
        const user = snapshot && snapshot.val();
        console.log('createArtist-------- == snapshot.val()=user==', user)

        if (!user) {
            console.log('user does not exist');
            return res.status(400).json({ errorCode: 400, errorMessage: 'user does not exist' });
        }
        if (!common.isString(user.accountType) || 'musician' !== user.accountType) {
            console.log('accountType is wrong');
            return res.status(400).json({ errorCode: 400, errorMessage: 'accountType' });
        }

        // TODO add validations

        // TODO add user to users and accountType objects with name and type
        const creationTime = new Date().toJSON();
        const profileUrl = req.body.profileUrl.trim().replace(/ /g, '_').replace(/[^\w\s]/gi, '');
        const newEntity = {
            creationTime: creationTime,
            displayName: req.body.title,
            genre: req.body.genre,
            style: req.body.style,
            description: req.body.description,
            accountType: 'artist',
            location: req.body.location,
            managers: {},
            profileUrl: profileUrl
        };

        Object.keys(newEntity.location).forEach(key => { // TODO remove any non permitted props from location
            if (!newEntity.location[key] && newEntity.location[key] !== false) {
                delete newEntity.location[key];
            }
        });

            newEntity.managers[req.user.uid] = {
                creationTime: creationTime,
                accountType: user.accountType,
                uid: req.user.uid
            };
            return checkArtistUrl(newEntity.profileUrl).then((isUrlFree) => {
                if (!isUrlFree) {
                    console.log('profileUrl exists');
                    return res.status(400).json({ errorCode: 400, errorMessage: 'profileUrl exists' });
                } else {
                    return admin.database().ref(`artists`)
                    .push(newEntity)
                    .then(newArtist => {
                        console.log('---------new artist ----', newArtist);
                        return newArtist.update({ 'uid': newArtist.key })
                        .then(snapshot => {
                            newEntity.uid = newArtist.key;
                            return admin.database().ref(`/users/${req.user.uid}/artists/${newEntity.uid}`).set(newEntity)
                            .then((response) => {
                                console.log('------response--end-----', response);
                                res.status(200).json({ code: 200, message: 'ok', user: {
                                    uid: req.user.uid,
                                }});
                            });
                        });
                    });
                }
            });
    });
};

exports.default = createArtist;
