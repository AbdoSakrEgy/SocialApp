import { GraphQLNonNull, GraphQLString } from "graphql";
import { authResolves } from "./auth.resolves";
import { signupRes } from "../../types/qraphql.types";

export const authFieldsQuery = {};

export const authFieldsMutation = {
  signup: {
    type: signupRes,
    args: {
      firstName: { type: new GraphQLNonNull(GraphQLString) },
      lastName: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: authResolves.signup,
  },
  login: {
    type: signupRes,
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve:authResolves.login
  },
};
