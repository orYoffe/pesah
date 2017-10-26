const admin = require('firebase-admin');

exports.getArtists = (req, res) => {
    if (req.query.coutry) { // TODO add params and options
        console.log('getArtists was called with country ===== ', req.query.coutry);
    } else {
        return admin.database().ref(`artists`).once("value").then(snapshot => {
            let artists = [];
            snapshot.forEach(function (childSnapshot) {
                const artist = childSnapshot.val();
                if (!artist.disabled && artist.uid) {
                    artists.push(artist);
                }
                if (artists.length > 5) {
                    return true;
                }
            });
            res.status(200).json(artists);
        })
    }
};

exports.getVenues = (req, res) => {
    if (req.query.coutry) { // TODO add params and options
        console.log('getVenues was called with country ===== ', req.query.coutry);
    } else {
        return admin.database().ref(`venues`).once("value").then(snapshot => {
            let venues = [];
            snapshot.forEach(function (childSnapshot) {
                const venue = childSnapshot.val();
                if (!venue.disabled && venue.uid) {
                    venues.push(venue);
                }
                if (venues.length > 5) {
                    return true;
                }
            });
            res.status(200).json(venues);
        })
    }
};

exports.getFans = (req, res) => {
    if (req.query.coutry) { // TODO add params and options
        console.log('getFans was called with country ===== ', req.query.coutry);
    } else {
        return admin.database().ref(`fans`).once("value").then(snapshot => {
            let fans = [];
            snapshot.forEach(function (childSnapshot) {
                const fan = childSnapshot.val();
                if (!fan.disabled && fan.uid) {
                    fans.push(fan);
                }
                if (fans.length > 5) {
                    return true;
                }
            });
            res.status(200).json(fans);
        })
    }
};

exports.getEvents = (req, res) => {
    if (req.query.coutry) { // TODO add params and options
        console.log('getEvents was called with country ===== ', req.query.coutry);
    } else {
        return admin.database().ref(`events`).once("value").then(snapshot => {
            let events = [];
            snapshot.forEach(function (childSnapshot) {
                const event = childSnapshot.val();
                if (!event.disabled && event.uid) {
                    events.push(event);
                }
                if (events.length > 5) {
                    return true;
                }
            });
            res.status(200).json(events);
        })
    }
};