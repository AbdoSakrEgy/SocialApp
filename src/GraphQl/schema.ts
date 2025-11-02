import { mutation } from "./mutation";
import { GraphQLSchema } from "graphql";
import { query } from "./query";

// GraphQLObjectType({name,fields})
// field({type,args,resolve})
export const schema = new GraphQLSchema({
  query,
  mutation,
});
