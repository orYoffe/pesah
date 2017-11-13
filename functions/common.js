
const isString = str => str && typeof str === 'string' && str.length > 0;
const isNumber = num => !isNaN(parseInt(num, 10));
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isEmailValid = (email) => emailRegex.test(email);
const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
const isUrlValid = (url) => urlRegex.test(url);
// const testBodyItem = (body, item) =>
const turnObjectToArray = obj => obj && typeof obj === 'object' ? Object.keys(obj).map(key => obj[key]) : []

exports.isString = isString;
exports.isNumber = isNumber;
exports.isEmailValid = isEmailValid;
exports.isUrlValid = isUrlValid;
exports.turnObjectToArray = turnObjectToArray;
