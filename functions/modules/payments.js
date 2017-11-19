const admin = require('firebase-admin');
const common = require('../common');


const paymentValidator = (req, res, isUpdate) => {
    console.log('createPayment was called ===== ', new Date().toJSON());
        // TODO validate user given strings
    if (!req.body || !req.body.paymentObject) {
        return res.status(400).send('paymentObject');
    }
    // TODO validate payments tokens

    // TODO get event
    const event = {}


    if (!event.isPublished || event.fundStatus === 'init') {// TODO validate
        return res.status(400).json({ errorCode: 400, errorMessage: 'unpublished' });
    }
    if (event.hasEnded) {// TODO validate
        return res.status(400).json({ errorCode: 400, errorMessage: 'ended' });
    }
    if (event.isFunded) {// TODO validate
        // TODO do normal ticket purchase

        if (!event.ticketsLeft) {// TODO validate
            return res.status(400).json({ errorCode: 400, errorMessage: 'no tickets left' });
        }
        // if user logged in
        if (req.user && req.user.uid) {// TODO validate
            // TODO add details to user and event and send email confirmation
        } else {
            // TODO store email and send email confirmation
        }

        return res.status(200).json({ errorCode: 200, errorMessage: 'normal purchase' });
    } else {
        // TODO add pledge to event
        // TODO add to funding amount
        const newAmount = event.pledgedAmount + event.ticketPrice;
        // TODO update event

        if (newAmount >= event.goalPrice) {
            // TODO chage the status of the event to funded
            // TODO charge all of the payments pledged
        }

        // if user logged in
        if (req.user && req.user.uid) {// TODO validate
            // TODO add details to user and event and send email confirmation
        } else {
            // TODO store email and send email confirmation
        }
    }



// TODO
// TODO
// TODO
// TODO
// TODO
// TODO Create cron job to check if event.hasEnded and to switch between the statuses
// TODO if event ended and not funded then send notifications and update
// TODO if event ended and funded then send notifications and update
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO

























    // if (!req.user.email_verified) {
    //     return res.status(400).json({ errorCode: 400, errorMessage: 'email' });
    // }
    // // TODO finish and add update functionality
    // if (isUpdate && !req.body.paymentObject.uid) {
    //     return res.status(400).json({ errorCode: 400, errorMessage: 'uid' });
    // }
    // return admin.database().ref(`users/${req.user.uid}`).once("value").then(snapshot => {
    //     const user = snapshot.val();
    //     const payment = req.body.paymentObject;
    //
    //     const isArtist = user.accountType === 'artist'
    //     const isVenue = user.accountType === 'venue'
    //     if (isUpdate) {
    //
    //     }
    //     // TODO add validations
    //
    //     if (isUpdate) {
    //         console.log('--------update venue payment=====', payment);
    //         return admin.database().ref(`venues/${payment.uid}`).update(payment)
    //         .then(newVenue => {
    //             return res.status(200).json({ code: 200, message: 'ok', uid: payment.uid });
    //         })
    //     } else {
    //
    //     const newPayment = {
    //     }
    //
    //     console.log('newPayment--------------', newPayment);
    //     return admin.database().ref(`payments`)
    //         .push(newPayment)
    //         .then(newDBPayment => {
    //             // payment id => newDBPayment.key
    //             res.status(200).json(newDBPayment);
    //             return newDBPayment.update({ 'uid': newDBPayment.key })
    //                 .then(snapshot => admin.database().ref(`${isArtist ? 'artists' : 'venues'}/${user.uid}/payments/${newDBPayment.key}`)
    //                     .set({ uid: newDBPayment.key })
    //                     .then(paymentId => {
    //                         // TODO add venue update if it is a user
    //                         return newDBPayment
    //                     }))
    //         });
    //     }
    // });
};

const createPayment = (req, res) => paymentValidator(req, res);
const updatePayment = (req, res) => paymentValidator(req, res, true);

exports.createPayment = createPayment;
exports.updatePayment = updatePayment;
