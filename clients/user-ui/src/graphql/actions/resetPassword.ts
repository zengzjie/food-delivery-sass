import { DocumentNode, gql } from "@apollo/client";

export const RESET_PASSWORD_QUERY: DocumentNode = gql`
  query ResetPassword($email: String!) {
    resetPassword(resetPasswordInput: { email: $email }) {
      code
      msg
    }
  }
`;
