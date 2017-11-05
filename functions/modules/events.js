const functions = require('firebase-functions');
const admin = require('firebase-admin');


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

// const createRoom = event => {
//     console.log('event==createRoom== ', event);

//     const room = event.data.val();
//     const eventId = event.params.uid;
//     const members = Object.keys(room.members);
//     const newRoom = {
//         uid: eventId,
//         members: room.members
//     };

//     members.forEach(member => {
//         admin.database().ref(`/users/${member.uid}/rooms`).then(rooms => {
//             console.log('event==rooms== ', rooms);
//             if (rooms && Object.keys(rooms).length) {
//                 rooms.update(newRoom.uid, newRoom)
//             } else {// if room doesn't exist create the object
//                 const newRooms = {};
//                 newRooms[newRoom.uid] = newRoom;
//                 return rooms.set(newRooms);
//             }
//         })
//     })
// };

exports.disableUser = functions.auth.user().onDelete(disableUser);
// exports.createRoom = functions.database.ref('/rooms/{uid}').onCreate(createRoom);