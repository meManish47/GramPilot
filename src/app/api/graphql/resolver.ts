import createUser, { currentUser, loginUser } from "./resolvers/user";

export const resolvers = {
  Query: {
    currentUser,
    loginUser,
  },
  Mutation: {
    createUser,
  },
};
