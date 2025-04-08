import { DocumentNode, gql } from "@apollo/client";

export const LOGIN_MUTATION: DocumentNode = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      code
    }
  }
`;
