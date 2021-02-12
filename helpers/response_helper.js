// Generic Responses

class ResponseHelper {
    /**
     *
     * @param res
     * @param errors
     * @returns send validation error response
     */
    static validationResponse(res, errors) {
        return ResponseHelper.getResponse(res, "Validation error!", errors, 422);
    }

    /**
     *
     * @param res
     * @param message
     * @param data
     * @returns {*}
     */
    static response200(res, message = "Ok", data = null) {
        return ResponseHelper.getResponse(res, message, data, 200);
    }

    /**
     *
     * @param res
     * @param message
     * @param errors
     * @returns {*}
     */
    static response400(res, message = "Bad Request", errors = null) {
        return ResponseHelper.getResponse(res, message, errors, 400);
    }

    /**
     *
     * @param res
     * @param message
     * @param errors
     * @returns {*}
     */
    static response401(res, message = "Unauthenticated", errors = null) {
        return ResponseHelper.getResponse(res, message, errors, 401);
    }

    /**
     *
     * @param res
     * @param message
     * @param errors
     * @returns {*}
     */
    static response403(res, message = "Forbidden", errors = null) {
        return ResponseHelper.getResponse(res, message, errors, 403);
    }

    /**
     *
     * @param res
     * @param message
     * @param errors
     * @returns {*}
     */
    static response404(res, message = "Not found", errors = null) {
        return ResponseHelper.getResponse(res, message, errors, 404);
    }

    /**
     *
     * @param res
     * @param message
     * @param errors
     * @returns {*}
     */
    static response422(res, message = "Unprocessable entity!", errors = null) {
        const response = {};
        response.message = message;
        response.errors = errors;
        if (!('status' in res)) {
            response.status = 422;
            return res(response);
        }
        return res.status(422).json(response);
    }

    /**
     *
     * @param res
     * @param message
     * @param data
     * @returns {*}
     */
    static response500(res, message = "Internal Server Error", data = null) {
        return ResponseHelper.getResponse(res, message, data, 500);
    }

    /**
     *
     * @param res  response Object
     * @param message  response message text
     * @param data  response data
     * @param statusCode response status
     */
    static getResponse(res, message, data, statusCode) {
        const response = {};

        response.message = message;
        if (data) {
            response.data = data;
        }
        if (!('status' in res)) {
            response.status = statusCode;
            return res(response);
        }
        return res.status(statusCode).json(response);
    }
}

module.exports = ResponseHelper;