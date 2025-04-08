"use client";
import { gql, DocumentNode } from "@apollo/client";

export const ACTIVATE_USER_MUTATION: DocumentNode = gql`
  mutation ActivateUser($activation_token: String!, $activation_code: String!) {
    activateUser(
      activationInput: {
        activation_token: $activation_token
        activation_code: $activation_code
      }
    ) {
      code
    }
  }
`;
