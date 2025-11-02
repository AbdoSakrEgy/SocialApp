"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const graphql_1 = require("graphql");
const user_fields_1 = require("./user/user.fields");
exports.query = new graphql_1.GraphQLObjectType({
    name: "query",
    fields: {
        ...user_fields_1.userFieldsQuery,
    },
});
