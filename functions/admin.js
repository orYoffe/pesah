const admin = require('firebase-admin');
const common = require('./common');


const adminCreateVenue = (req, res) => {
    console.log('admin was called ===== ', new Date().toJSON());
    // TODO validate user given strings
    if (req.body && req.user && req.user.iAdmin) {
        const body = req.body;
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
                    if (!body[key]) {
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
                console.log('--------new venue body=====', body);
                return admin.database().ref(`venues`).push(body).then(newVenue => {
                    res.status(200).json({ code: 200, message: 'ok', uid: newVenue.key });
                    return newVenue.update({ 'uid': newVenue.key })
                })
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

exports.adminCreateVenue = adminCreateVenue;