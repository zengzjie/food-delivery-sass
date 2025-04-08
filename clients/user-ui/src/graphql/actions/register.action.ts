"use client";
import { gql, DocumentNode } from "@apollo/client";

export const REGISTER_MUTATION: DocumentNode = gql`
  mutation Register(
    $name: String!
    $email: String!
    $mobile: String!
    $password: String!
  ) {
    register(
      registerInput: {
        name: $name
        email: $email
        mobile: $mobile
        password: $password
      }
    ) {
      activation_token
    }
  }
`;
