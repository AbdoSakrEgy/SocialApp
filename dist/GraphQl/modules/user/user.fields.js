"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFieldsMutation = exports.userFieldsQuery = void 0;
const graphql_1 = require("graphql");
const user_resolves_1 = require("./user.resolves");
const qraphql_types_1 = require("../../types/qraphql.types");
exports.userFieldsQuery = {
    getAllUsers: {
        type: new graphql_1.GraphQLList(qraphql_types_1.userType),
        args: { token: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) } },
        resolve: user_resolves_1.userResolves.getAllUsers,
    },
    getUserProfile: {
        type: qraphql_types_1.userType,
        resolve: user_resolves_1.userResolves.getUserProfile
    },
};
exports.userFieldsMutation = {};
