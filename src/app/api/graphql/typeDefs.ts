import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    currentUser: User
  }
  type Mutation {
    createUser(name: String!, email: String!, password: String!): CustomResponse
  }
  type CustomResponse {
    success: Boolean
    message: String
  }
  type User {
    name:String
    email:String
    password:String
    id:String
    role:String
  }
`;
