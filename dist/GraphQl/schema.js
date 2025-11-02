"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const mutation_1 = require("./mutation");
const graphql_1 = require("graphql");
const query_1 = require("./query");
// GraphQLObjectType({name,fields})
// field({type,args,resolve})
exports.schema = new graphql_1.GraphQLSchema({
    query: query_1.query,
    mutation: mutation_1.mutation,
});
