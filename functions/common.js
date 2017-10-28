
const isString = str => str && typeof str === 'string' && str.length > 0;
const isNumber = num => !isNaN(parseInt(num, 10));

exports.isString = isString;
exports.isNumber = isNumber;