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
        const roomId = newDBRoom.key;
        newRoom.uid = roomId;
        
        const promises = [
            newDBRoom.update({ 'uid': roomId }),
            admin.database().ref(`members/${roomId}`).set(members),
            admin.database().ref(`messages/${roomId}`).set(messages)
        ];
        
        const userRoom = {
            uid: newRoom.uid,
            members: members
        };

        [user.uid, chatPartner.uid].forEach((memberId) => {
            const promise = admin.database().ref(`/users/${memberId}/rooms`).update({[userRoom.uid]: userRoom});
            promises.push(promise);
        });
        res.status(200).json({ code: 200, message: 'ok', roomId: newDBRoom.key });
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
                const roomId = rooms.find(roomId => {
                    // check if users have a private roomId
                    const members = Object.keys(userRooms[roomId].members);
                    if (members['uid']) {
                        delete members['uid'];
                    }
                    return members.length === 2 && members.includes(user.uid) && members.includes(chatPartner.uid)
                })
                if (roomId && userRooms[roomId] && userRooms[roomId].uid) {
                    console.log('----------------get room ---- room exists=================');
                    return res.status(200).json({ code: 200, message: 'ok', roomId: userRooms[roomId].uid});
                } else {
                    console.log('----------------get room ---- room creating=================');
                    return createRoom(chatPartner, user, res);
                }
            } else {
                console.log('----------------get room ----user has no rooms - room creating=================');
                return createRoom(chatPartner, user, res);
            }
        });
    } else {
        res.status(400).send('chatPartner uid');
    }
};

exports.default = getRoom;