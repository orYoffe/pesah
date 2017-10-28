const admin = require('firebase-admin');
const common = require('./common');

const createRoom = (chatPartner, user, res) => {
    const members = {
        [user.uid]: {
            uid: user.uid,
            photo: user.photoURL || '',
            displayName: user.displayName
        },
        [chatPartner.uid]: {
            uid: chatPartner.uid,
            photo: chatPartner.photoURL || '',
            displayName: chatPartner.displayName
        }
    };
    const messages = {};
    const newRoom = {
        creator: user.uid,
        timeCreated: new Date().toJSON()
    };
    return admin.database().ref(`rooms`).push(newRoom)
    .then(newDBRoom => {
        res.status(200).json({ code: 200, message: 'ok', roomId: newDBRoom.key });
        const roomId = newDBRoom.key;
        newRoom.uid = roomId;
        members.uid = roomId;
        messages.uid = roomId;

        const promises = [
            newDBRoom.update({ 'uid': roomId }),
            admin.database().ref(`members/${roomId}`).set(members),
            admin.database().ref(`messages/${roomId}`).set(messages)
        ];

        const userRoom = {
            uid: newRoom.uid,
            members: members
        };

        members.forEach((member) => {
            console.log('---member.uid == ', member.uid);
            const promise = admin.database().ref(`/users/${member.uid}/rooms`).once('value')
            .then(snapshot => {
                const rooms = snapshot.val();
                console.log('event==rooms== ', rooms);
                if (rooms && Object.keys(rooms).length) {
                    return rooms.update(userRoom.uid, userRoom);
                } else {// if room doesn't exist create the object
                    const newRooms = { [userRoom.uid]: userRoom };
                    return rooms.set(newRooms);
                }
            });
            promises.push(promise);
        });
        return Promise.all(promises);
    })
    .catch(err => console.log(err));
}


const getRoom = (req, res) => {
    console.log('getRoom was called ===== ', new Date().toJSON());
    // TODO validate user given strings
    if (req.body && req.body.uid) {
        const chatPartner = req.body;
        // ============= TODO add req.user.email_verified validation 
        // if (!req.user.email_verified) {
        //     return res.status(400).json({ errorCode: 400, errorMessage: 'email' });
        // }
        // =============
        if (!chatPartner || !common.isString(chatPartner.displayName) || chatPartner.displayName.length < 4) {
            return res.status(400).json({ errorCode: 400, errorMessage: 'displayName' });
        }
        return admin.database().ref(`users/${req.user.uid}`).once("value").then(snapshot => {
            const user = snapshot.val();
            const userRooms = user.rooms;
            const rooms = userRooms && Object.keys(userRooms);

            // TODO add validations

            if (rooms && rooms.length) {
                const room = rooms.find(room => {
                    // check if users have a private room
                    const members = Object.keys(userRooms[room].members)
                    return members.length === 2 && members.includes(user.uid) && members.includes(chatPartner.uid)
                })
                if (room && userRooms[room] && userRooms[room].uid) {
                    return res.status(200).json({ code: 200, message: 'ok', roomId: userRooms[room].uid});
                } else {
                    return createRoom(chatPartner, user, res);
                }
            } else {
                return createRoom(chatPartner, user, res);
            }
        });
    } else {
        res.status(400).send('chatPartner uid');
    }
};

exports.default = getRoom;