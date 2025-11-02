"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authFields = void 0;
const graphql_1 = require("graphql");
const auth_resolves_1 = require("./auth.resolves");
const qraphql_types_1 = require("../../types/qraphql.types");
exports.authFields = {
    signup: {
        type: qraphql_types_1.signupRes,
        args: {
            firstName: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            lastName: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        },
        resolve: auth_resolves_1.authResolves.signup,
    },
};
