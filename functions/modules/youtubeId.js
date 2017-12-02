const admin = require('firebase-admin');
const common = require('../common');

const youtubeRegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i; // eslint-disable-line no-useless-escape

const updaloadYoutubeUrl = (req, res) => {
  if (!req.body || !req.body.youtubeURL) {
      return res.status(400).json({ errorCode: 400, errorMessage: 'youtubeURL' });
  }
  if (!common.isString(req.body.youtubeURL) || req.body.youtubeURL.length < 4) {
      return res.status(400).json({ errorCode: 400, errorMessage: 'youtubeURL' });
  }

  const url = req.body.youtubeURL.trim();
  const match = url.match(youtubeRegexp);
  if (!match || !match[1]) {
      return res.status(400).json({ errorCode: 400, errorMessage: 'youtubeURL' });
  }
  return admin.database().ref(`artists/${req.user.uid}`).update({ youtubeID: match[1] })
  .then((response) => {
    return res.status(200).json({ code: 200, message: 'ok' });
  })
  .catch((error) => {
      return res.status(400).json({ errorCode: 400, errorMessage: 'youtubeURL' });
  });
}

exports.default = updaloadYoutubeUrl;
