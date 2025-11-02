"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const graphql_1 = require("graphql");
const graphql_types_1 = require("../types/graphql.types");
const users = [
    {
        id: 1,
        name: "abdo",
        isActive: true,
        gender: "male",
    },
    {
        id: 2,
        name: "warda",
        isActive: false,
        gender: "female",
    },
];
exports.query = new graphql_1.GraphQLObjectType({
    name: "query",
    fields: {
        hello: {
            type: graphql_1.GraphQLString,
            resolve: () => {
                return "hello graphql";
            },
        },
        sayHi: {
            type: graphql_1.GraphQLString,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (parent, args, context, info) => {
                return `Hi ${args.name}`;
            },
        },
        user: {
            type: graphql_types_1.userType,
            resolve: () => {
                return users[0];
            },
        },
        users: {
            type: new graphql_1.GraphQLList(graphql_types_1.userType),
            resolve: () => {
                return users;
            },
        },
    },
});
