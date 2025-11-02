import { GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { userResolves } from "./user.resolves";
import { userType } from "../../types/qraphql.types";

export const userFieldsQuery = {
  getAllUsers: {
    type: new GraphQLList(userType),
    args: { token: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: userResolves.getAllUsers,
  },
  getUserProfile: {
    type: userType,
    resolve:userResolves.getUserProfile
  },
};

export const userFieldsMutation = {};
