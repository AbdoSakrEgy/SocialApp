"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = void 0;
const graphql_1 = require("graphql");
const graphql_types_1 = require("../../../types/graphql.types");
const user_resolves_1 = require("./user.resolves");
exports.userFields = {
    hello: {
        type: graphql_1.GraphQLString,
        resolve: user_resolves_1.userResolves.hello,
    },
    sayHi: {
        type: graphql_1.GraphQLString,
        args: {
            name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        },
        resolve: user_resolves_1.userResolves.sayhi,
    },
    user: {
        type: graphql_types_1.userType,
        resolve: user_resolves_1.userResolves.user,
    },
    users: {
        type: new graphql_1.GraphQLList(graphql_types_1.userType),
        resolve: user_resolves_1.userResolves.users,
    },
};
