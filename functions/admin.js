const admin = require('firebase-admin');
const common = require('./common');


const venueValidator = (req, res, isUpdate) => {
    console.log('venueValidator was called ===== isUpdate=', isUpdate, '==time==', new Date().toJSON());
    // TODO validate user given strings
    if (req.body && req.user && req.user.isAdmin) {
        const body = req.body;
        if (isUpdate && !body.uid) {
            return res.status(400).json({ errorCode: 400, errorMessage: 'missing venue id' });
        }
        if (body.name && common.isString(body.name) && body.name.length > 3) {
            if (
                body.locationAddress && common.isString(body.locationAddress) && body.locationAddress.length > 3
                && body.locationCity && common.isString(body.locationCity) && body.locationCity.length > 3
                && body.locationCountry && common.isString(body.locationCountry) && body.locationCountry.length > 3
                && body.locationCountryShortName && common.isString(body.locationCountryShortName) && body.locationCountryShortName.length > 1
                && body.locationLat && common.isNumber(body.locationLat)
                && body.locationLng && common.isNumber(body.locationLng)
            ) {
                
                Object.keys(body).forEach(key => {
                    if (!body[key] && body[key] !== false) {
                        delete body[key];
                    }
                })
                if (body.venueEmail) {
                    if (!common.isEmailValid(body.venueEmail)) {
                        return res.status(400).json({ errorCode: 400, errorMessage: 'venueEmail' });
                    }
                }
                if (body.website) {
                    if (!common.isUrlValid(body.website)) {
                        return res.status(400).json({ errorCode: 400, errorMessage: 'website' });
                    }
                }
                if (body.fb) {
                    if (!common.isUrlValid(body.fb)) {
                        return res.status(400).json({ errorCode: 400, errorMessage: 'fb' });
                    }
                }
                if (isUpdate) {
                    console.log('--------update venue body=====', body);
                    return admin.database().ref(`venues/${body.uid}`).update(body).then(newVenue => {
                        return res.status(200).json({ code: 200, message: 'ok', uid: body.uid });
                    })
                } else {
                    body.hasUser = false;
                    console.log('--------new venue body=====', body);
                    return admin.database().ref(`venues`).push(body).then(newVenue => {
                        res.status(200).json({ code: 200, message: 'ok', uid: newVenue.key });
                        return newVenue.update({ 'uid': newVenue.key })
                    })
                }
            } else {
                return res.status(400).json({ errorCode: 400, errorMessage: 'address' });
            }
        } else {
            return res.status(400).json({ errorCode: 400, errorMessage: 'name' });
        }
    } else {
        return res.status(400).json({ errorCode: 400, errorMessage: 'empty body' });
    }
};

const adminCreateVenue = (req, res) => venueValidator(req, res);
const adminUpdateVenue = (req, res) => venueValidator(req, res, true);

exports.adminCreateVenue = adminCreateVenue;
exports.adminUpdateVenue = adminUpdateVenue;