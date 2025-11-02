import { GraphQLObjectType } from "graphql";
import { userFieldsQuery } from "./modules/user/user.fields";

export const query = new GraphQLObjectType({
  name: "query",
  fields: {
    ...userFieldsQuery,
  },
});
