"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userType = exports.GenderEnum = void 0;
const graphql_1 = require("graphql");
exports.GenderEnum = new graphql_1.GraphQLEnumType({
    name: "GenderEnum",
    values: {
        MALE: { value: "male" },
        FEMALE: { value: "female" },
    },
});
exports.userType = new graphql_1.GraphQLObjectType({
    name: "user",
    fields: {
        id: { type: graphql_1.GraphQLInt },
        name: { type: graphql_1.GraphQLString },
        isActive: { type: graphql_1.GraphQLBoolean },
        gender: {
            type: exports.GenderEnum,
        },
    },
});
