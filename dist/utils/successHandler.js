"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successHandler = void 0;
const successHandler = ({ res, message = "Done", status = 200, result = {}, }) => {
    return res.status(status).json({ message, status, result });
};
exports.successHandler = successHandler;
