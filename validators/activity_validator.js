"use strict";

const Validator = require('./validator');

class ActivityValidator extends Validator {
  // rules
  rules = {
    userId:'required|isValidMongoId',
    name: 'string'
  };
}

module.exports=ActivityValidator;