const moment = require('moment')
const helper = require('./helper')

const isValidString = function (value) {
   if (typeof value === "undefined" || value === null) return false;
   if (typeof value === "String" && value.trim().length === 0) return false;
   return true;
};

const isValidNumber = function (value) {
   if (typeof value === "undefined" || value === null) return false;
   if (value < 0) return false;
   if (typeof value === "String" && value.trim().length === 0) return false;
   return true;
};

const isValidRequestBody = function (value) {
   return Object.keys(value).length > 0;
};

const isValidDate = function (value) {
   const today = new Date()
   value = new Date(value)
   return moment(value, 'YYYY-MM-DD', true).isValid()
};


module.exports = {
   isValidNumber,
   isValidString,
   isValidRequestBody,
   isValidDate
};
