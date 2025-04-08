import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUserDetail {
    getUserDetail {
      id
      name
      email
      sex
      mobile
      avatar {
        id
        public_id
        url
      }
      address
      role
      posts {
        id
        title
        content
      }
    }
  }
`;
