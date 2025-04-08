import { GET_USER } from "@/graphql/actions/getUserDetail.action";
import { useLazyQuery } from "@apollo/client";

type TAvatar = Partial<{
  id: string;
  public_id: string;
  url: string;
  userId: string;
}>;

type TPost = Partial<{
  id: string;
  title: string;
  content: string;
  user: IUserInfo;
  userId: string;
  createAt: Date;
  updateAt: Date;
}>;

export interface IUserInfo {
  address: string | null;
  avatar: TAvatar | null;
  email: string;
  id: string;
  mobile: string;
  name: string;
  posts: TPost[]; // Changed to any[] type
  role: string;
  sex: number;
}

const useUserInfo = () => {
  const [getUserInfo] = useLazyQuery(GET_USER, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "no-cache",
  });
  return {
    getUserInfo,
  };
};

export default useUserInfo;
