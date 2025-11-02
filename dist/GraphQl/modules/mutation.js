"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutation = void 0;
const graphql_1 = require("graphql");
const auth_fields_1 = require("./auth/auth.fields");
exports.mutation = new graphql_1.GraphQLObjectType({
    name: "mutation",
    fields: {
        ...auth_fields_1.authFieldsMutation,
    },
});
