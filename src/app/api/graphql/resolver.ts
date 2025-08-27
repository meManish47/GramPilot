import createUser, { currentUser } from "./resolvers/user";

export const resolvers = {
  Query: {
    currentUser,
  },
  Mutation: {
    createUser,
  },
};
