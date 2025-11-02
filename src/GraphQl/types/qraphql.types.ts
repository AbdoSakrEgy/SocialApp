import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const GenderEnum = new GraphQLEnumType({
  name: "GenderEnum",
  values: {
    MALE: { value: "male" },
    FEMALE: { value: "female" },
  },
});

export const userType = new GraphQLObjectType({
  name: "userType",
  fields: {
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString },
    phone: { type: GraphQLString },
    role: { type: GraphQLString },
    email: { type: GraphQLString },
    newEmail: { type: GraphQLString },
    emailConfirmed: { type: GraphQLBoolean },
    credentialsChangedAt: { type: GraphQLString },
    isActive: { type: GraphQLBoolean },
    // deletedBy: object,
    profileImage: { type: GraphQLString },
    profileVideo: { type: GraphQLString },
    avatarImage: { type: GraphQLString },
    coverImages: { type: new GraphQLList(GraphQLString) },
    // friends: Types.ObjectId[],
    // blockList: Types.ObjectId[],
    is2FAActive: { type: GraphQLBoolean },
  },
});

export const signupRes = new GraphQLObjectType({
  name: "signupRes",
  fields: {
    message: { type: GraphQLString },
    status: { type: GraphQLInt },
    result: {
      type: new GraphQLObjectType({
        name: "result",
        fields: {
          accessToken: { type: GraphQLString },
          refreshToken: { type: GraphQLString },
        },
      }),
    },
  },
});
