const date = require('date-and-time');

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
   if (today <= value) return false;
   return date.isValid(value, 'YYYY-MM-DD');
};

module.exports = {
   isValidNumber,
   isValidString,
   isValidRequestBody,
   isValidDate
};
