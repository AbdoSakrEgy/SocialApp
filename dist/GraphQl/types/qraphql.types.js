"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupRes = exports.userType = exports.GenderEnum = void 0;
const graphql_1 = require("graphql");
exports.GenderEnum = new graphql_1.GraphQLEnumType({
    name: "GenderEnum",
    values: {
        MALE: { value: "male" },
        FEMALE: { value: "female" },
    },
});
exports.userType = new graphql_1.GraphQLObjectType({
    name: "userType",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        firstName: { type: graphql_1.GraphQLString },
        lastName: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt },
        gender: { type: graphql_1.GraphQLString },
        phone: { type: graphql_1.GraphQLString },
        role: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        newEmail: { type: graphql_1.GraphQLString },
        emailConfirmed: { type: graphql_1.GraphQLBoolean },
        credentialsChangedAt: { type: graphql_1.GraphQLString },
        isActive: { type: graphql_1.GraphQLBoolean },
        // deletedBy: object,
        profileImage: { type: graphql_1.GraphQLString },
        profileVideo: { type: graphql_1.GraphQLString },
        avatarImage: { type: graphql_1.GraphQLString },
        coverImages: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        // friends: Types.ObjectId[],
        // blockList: Types.ObjectId[],
        is2FAActive: { type: graphql_1.GraphQLBoolean },
    },
});
exports.signupRes = new graphql_1.GraphQLObjectType({
    name: "signupRes",
    fields: {
        message: { type: graphql_1.GraphQLString },
        status: { type: graphql_1.GraphQLInt },
        result: {
            type: new graphql_1.GraphQLObjectType({
                name: "result",
                fields: {
                    accessToken: { type: graphql_1.GraphQLString },
                    refreshToken: { type: graphql_1.GraphQLString },
                },
            }),
        },
    },
});
