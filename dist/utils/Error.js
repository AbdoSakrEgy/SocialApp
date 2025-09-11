"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationExpection = void 0;
class ApplicationExpection extends Error {
    statusCode;
    constructor(msg, statusCode, options) {
        super(msg, options);
        this.statusCode = statusCode;
    }
}
exports.ApplicationExpection = ApplicationExpection;
