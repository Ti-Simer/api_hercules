"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(statusCode, message, data = null) {
        return {
            statusCode,
            message,
            data,
        };
    }
    static error(statusCode, message, data = null) {
        return {
            statusCode,
            message,
            data
        };
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.util.js.map