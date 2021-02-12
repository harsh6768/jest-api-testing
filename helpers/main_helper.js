const ResponseHelper = require('./response_helper');

class MainHelper extends ResponseHelper {

    static mongoIdValidationRule() {
        return "regex:/^[0-9a-fA-F]{24}$/";
    }

    static isValidMongoId(id = "") {
        return id.match(/^[0-9a-fA-F]{24}$/);
    }

   
}

module.exports = MainHelper;
