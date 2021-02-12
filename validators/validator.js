"use strict";

const ValidatorJS = require("validatorjs");

class Validator {
  // rules
  rules = {};

  // error messages
  messages = {};

  // validated fields' object
  validated = {};

  // object to be validated
  data = {};

  // validator
  validator;

  isValidated = false;

  /**
   * Constructor
   * @param {*} req
   */
  constructor(req) {
    this.data = req.body;
  }

  /**
   * Check if the validator fails
   */
  fails() {
    if(!this.isValidated) {
      this.initialize();
    }
    return this.validator.fails();
  }

  /**
   * Check if the validator passes
   */
  passes() {
    if(!this.isValidated) {
      this.initialize();
    }
    return this.validator.passes();
  }

  errors() {
    return this.validator.errors;
  }

  /**
   * Get only the validated content
   */
  initialize(getNull = false) {
    this.validator = new ValidatorJS(this.data, this.rules, this.messages);
    for (const rule in this.rules) {
      if (this.data[rule] == undefined) {
        if (getNull) {
          this.validated[rule] = null;
        }
      } else {
        this.validated[rule] = this.data[rule];
      }
    }
    this.isValidated = true;
    return this;
  }
}

ValidatorJS.register('isValidMongoId', function (value, requirement, attribute) {
  return value.match(/^[0-9a-fA-F]{24}$/);
}, 'Provided :attribute is not valid');

module.exports = Validator;