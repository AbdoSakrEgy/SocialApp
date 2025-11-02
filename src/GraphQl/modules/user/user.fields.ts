import { GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { userResolves } from "./user.resolves";
import { userType } from "../../types/qraphql.types";

export const userFieldsQuery = {
  hello: {
    type: GraphQLString,
    resolve: userResolves.hello,
  },
  sayHi: {
    type: GraphQLString,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: userResolves.sayhi,
  },
  user: {
    type: userType,
    resolve: userResolves.user,
  },
  getAllUsers: {
    type: new GraphQLList(userType),
    args: { token: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: userResolves.getAllUsers,
  },
};

export const userFieldsMutation = {};
