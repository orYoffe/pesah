const admin = require('firebase-admin');

const getItems = (arr, type, max) => admin.database().ref(`${type}s`).once("value")
    .then(snapshot => {
        snapshot.forEach(function (childSnapshot) {
            const item = childSnapshot.val();
            if (!item.disabled && item.uid) {
                arr.push(item);
            }
            if (max ? arr.length > max : arr.length > 5) {
                return true;
            }
        });
    });

exports.getArtists = (req, res) => {
    console.log('getArtists was called ===== ', new Date().toJSON());
    if (req.query.coutry) { // TODO add params and options
        console.log('getArtists was called with country ===== ', req.query.coutry);
    } else {
        let artists = [];
        return getItems(artists, 'artist').then(() => res.status(200).json(artists));
    }
};

exports.getVenues = (req, res) => {
    console.log('getVenues was called ===== ', new Date().toJSON());
    if (req.query.coutry) { // TODO add params and options
        console.log('getVenues was called with country ===== ', req.query.coutry);
    } else {
        let venues = [];
        return getItems(venues, 'venue').then(() => res.status(200).json(venues));
    }
};

exports.getFans = (req, res) => {
    console.log('getFans was called ===== ', new Date().toJSON());
    if (req.query.coutry) { // TODO add params and options
        console.log('getFans was called with country ===== ', req.query.coutry);
    } else {
        let fans = [];
        return getItems(fans, 'fan').then(() => res.status(200).json(fans));
    }
};

exports.getEvents = (req, res) => {
    console.log('getEvents was called ===== ', new Date().toJSON());
    if (req.query.coutry) { // TODO add params and options
        console.log('getEvents was called with country ===== ', req.query.coutry);
    } else {
        let events = [];
        return getItems(events, 'event').then(() => res.status(200).json(events));
    }
};

exports.explore = (req, res) => {
    console.log('explore was called ===== ', new Date().toJSON());
    if (req.query.coutry) { // TODO add params and options
        console.log('getEvents was called with country ===== ', req.query.coutry);
    } else {
        let events = [];
        let venues = [];
        let fans = [];
        let artists = [];
        return getItems(events, 'event')
            .then(() => getItems(venues, 'venue'))
            .then(() => getItems(fans, 'fan'))
            .then(() => getItems(artists, 'artist'))
            .then(() => res.status(200).json({artists, events, fans, venues}))
    }
};