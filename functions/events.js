
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// const createProfile = event => {
//     console.log('event==onCreate== ', event);
//     return admin.database().ref(`/users/${event.data.uid}`).set({
//         creationTime: event.data.metadata.creationTime,
//         email: event.data.email,
//         rooms: {},
//         uid: event.data.uid
//     });
// };

const disableUser = (event) => {
    let accountType;
    console.log('event==onDelete== ', event);

    // return admin.database().ref(`/users/${user.uid}/disabled`).set({
    //   creationTime: user.metadata.creationTime,
    //   email: user.email,
    //   uid: user.uid
    // });

    // //TODO delete user's access but keep user
    try {
        
        return admin.database().ref(`/users/${event.data.uid}/disabled`)
        .then(user => {
            accountType = user.accountType;
            console.log('event==user== ', user);
            console.log('event==accountType== ', accountType);
            console.log('event==onDelete==Disabling event =', event);
            return user.child('disabled').set(true);
        })
        .then(() => (accountType === 'artist' || accountType === 'venue' || accountType === 'fan') &&
            admin.database().ref(`/${accountType}s/${event.data.uid}`).child('disabled').set(true)
        );
    } catch (error) {
        console.log('event==onDelete==called without real user ', event);
    }
};

const createRoom = event => {
    console.log('event==createRoom== ', event);

    const room = event.data;
    const members = Object.keys(room.members);
    const newRoom = {
        uid: room.uid || room.key,
        members: room.members
    };

    members.forEach(member => {
        admin.database().ref(`/users/${member.uid}/rooms`).then(rooms => {
            console.log('event==rooms== ', rooms);
            if (rooms && Object.keys(rooms).length) {
                rooms.update(newRoom.uid, newRoom)
            } else {// if room doesn't exist create the object
                const newRooms = {};
                newRooms[newRoom.uid] = newRoom;
                return rooms.set(newRooms);
            }
        })
    })
};

// exports.createProfile = functions.auth.user().onCreate(createProfile);
exports.disableUser = functions.auth.user().onDelete(disableUser);
exports.createRoom = functions.database.ref('/rooms/{uid}').onCreate(createRoom);

            
    // return admin.auth().getUser(event.data.uid)
    //     .then(function (userRecord) {
    //         // See the UserRecord reference doc for the contents of userRecord.
    //         console.log("onCreate === Successfully fetched user data:", userRecord.toJSON());
    //     })
    //     .catch(function (error) {
    //         console.log("onCreate === Error fetching user data:", error);
    //     });