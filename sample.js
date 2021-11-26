const moment = require('moment');

const date = moment('2020-12-19T01:12:14.567Z').format('Do MMM, hh:mm A');
console.log(date);

console.log(require('path').resolve(__dirname, './client/build', 'index.html'))
