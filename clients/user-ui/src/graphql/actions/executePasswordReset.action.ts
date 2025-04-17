import { DocumentNode, gql } from "@apollo/client";

export const EXECUTE_PASSWORD_RESET: DocumentNode = gql`
  mutation ExecutePasswordReset(
    $password: String!
    $token: String!
  ) {
    executePasswordReset(
      executePasswordResetInput: {
        password: $password
        token: $token
      }
    ) {
      code
      msg
    }
  }
`;
