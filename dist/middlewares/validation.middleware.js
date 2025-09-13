"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const Error_1 = require("../utils/Error");
const validation = (shcema) => {
    return (req, res, next) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query,
        };
        const result = shcema.safeParse(data);
        if (result.success) {
            next();
        }
        else {
            const issues = result.error?.issues;
            let messages = "";
            for (let item of issues) {
                messages += item.message + " \n ";
            }
            console.log(messages);
            throw new Error_1.ValidationError(messages);
        }
    };
};
exports.validation = validation;
