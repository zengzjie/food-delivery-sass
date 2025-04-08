import { DocumentNode, gql } from "@apollo/client";

export const REFRESH_TOKEN_MUTATION: DocumentNode = gql`
  mutation RefreshToken($refresh_token: String!) {
    refreshToken(refresh_token: $refresh_token) {
      success
    }
  }
`;
