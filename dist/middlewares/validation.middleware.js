"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationGraphQl = exports.validation = void 0;
const Errors_1 = require("../utils/Errors");
const graphql_1 = require("graphql");
const validation = (shcema) => {
    return (req, res, next) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query,
            // express.json() can't see or parssing fields that has files, so we create this field and put data in it manually
            profileImage: req.file,
            attachment: req.file,
            attachments: req.files,
        };
        const result = shcema.safeParse(data);
        if (!result.success) {
            const issues = result.error?.issues;
            let messages = "";
            for (let item of issues) {
                messages += item.message + " ||&&|| ";
            }
            throw new Errors_1.ValidationError(messages, 400);
        }
        next();
    };
};
exports.validation = validation;
const validationGraphQl = (shcema, args) => {
    const result = shcema.safeParse(args);
    if (!result.success) {
        const issues = result.error?.issues;
        let messages = "";
        for (let item of issues) {
            messages += item.message + " ||&&|| ";
        }
        throw new graphql_1.GraphQLError(messages, { extensions: { status: 400 } });
    }
};
exports.validationGraphQl = validationGraphQl;
