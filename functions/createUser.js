const admin = require('firebase-admin');

const isString = str => str && typeof str === 'string' && str.length > 0;
const isNumber = num => !isNaN(parseInt(num, 10));
const accountTypes = ['artist', 'venue', 'fan'];
const fan = {
    displayName: '',
    accountType: 'fan',
    email: '',
    emailVerified: false,
    photoURL: '',
    isAnonymous: false,
    uid: 0,
    providerData: null,
}
const artist = {
    displayName: '',
    accountType: 'artist',
    email: '',
    emailVerified: false,
    photoURL: '',
    isAnonymous: false,
    uid: 0,
    providerData: null,
    members: {},
    managers: {},
    futureEvents: {},
    pastEvents: {},
    claimed: false,
    accounts: {},
    collaborationPartners: {
        venues: {},
        artists: {}
    },
}
const venue = {
    displayName: '',
    accountType: 'venue',
    email: '',
    emailVerified: false,
    photoURL: '',
    isAnonymous: false,
    uid: 0,
    providerData: null,
    members: {},
    managers: {},
    futureEvents: {},
    pastEvents: {},
    claimed: false,
    accounts: {},
    collaborationPartners: {
        venues: {},
        artists: {}
    },
}

const accounts = {
    fan,
    artist,
    venue
}

const createUser = (req, res) => {
    console.log('createUser-------- == req.body===', req.body)
    console.log('createUser-------- == req.user===', req.user)
    /*


info: createUser-------- == req.body=== {
    displayName: 'barRaiser1',
  accountType: 'artist',
  uid: 'tzOWRj3hOqVI75FjEnSt9ZUFoRI2' }


info: createUser-------- == req.user=== { iss: 'https://securetoken.google.com/earlybirdshopers',
  aud: 'earlybirdshopers',
  auth_time: 1509109914,
  user_id: 'tzOWRj3hOqVI75FjEnSt9ZUFoRI2',
  sub: 'tzOWRj3hOqVI75FjEnSt9ZUFoRI2',
  iat: 1509109914,
  exp: 1509113514,
  email: 'bar.raisers@gmail.com',
  email_verified: false,
  firebase:
   { identities: { email: [Object] },
     sign_in_provider: 'password' },
  uid: 'tzOWRj3hOqVI75FjEnSt9ZUFoRI2' }

info: createUser-------- == snapshot.val()=user== null



          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          providerData: user.providerData,
          displayName: user.displayName,
          accountType: user.accountType,

    */
    if (
        req.body && req.body.displayName &&
        req.body.accountType && accountTypes.includes(req.body.accountType) &&
        req.body.uid && req.body.uid === req.user.uid
    ) {
        // TODO validate user given strings check for special chars
        if (!isString(req.body.displayName) || req.body.displayName.length < 4) {
            console.log('displayName is wrong');
            return res.status(400).json({ errorCode: 400, errorMessage: 'displayName' });
        }
        if (!isString(req.body.accountType) || !accountTypes.includes(req.body.accountType)) {
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
// };
            // return admin.database().ref(`events`)
            //     .push(newEvent)
            //     .then(newDBEvent => {
            //         // event id => newDBEvent.key
            //         res.status(200).json(newDBEvent);
            //         return newDBEvent.update({ 'uid': newDBEvent.key })
            //             .then(snapshot => admin.database().ref(`${isArtist ? 'artists' : 'venues'}/${user.uid}/events/${newDBEvent.key}`)
            //                 .set({ uid: newDBEvent.key })
            //                 .then(eventId => {
            //                     // TODO add venue update if it is a user
            //                     return newDBEvent
            //                 }))
            //     });
        });
    } else {
        res.status(400).send('Bad request body');
    }
};

exports.default = createUser;