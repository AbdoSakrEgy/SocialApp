import { GraphQLObjectType } from "graphql";
import { authFieldsMutation } from "./modules/auth/auth.fields";

export const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    ...authFieldsMutation,
  },
});
