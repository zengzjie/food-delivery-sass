import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
  DefaultContext,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { REFRESH_TOKEN_MUTATION } from "./actions/refreshToken.action";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export enum STATUS_CODE {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// 创建临时客户端用于发送刷新token请求
const createRefreshClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GQL_SERVICE_URL,
      credentials: "include",
    }),
    cache: new InMemoryCache(),
  });
};

// 跟踪是否正在刷新token，防止多次请求
let isRefreshing = false;
// ⌛️ 存储等待token刷新的回调
const pendingRequests: Function[] = [];

// 完成所有等待的请求
const processQueue = (success: boolean) => {
  pendingRequests.forEach((callback) => callback(success));
  pendingRequests.length = 0;
};

// 刷新 token 函数
const refreshTokenFn = async () => {
  try {
    const refresh_token = Cookies.get("Refresh_Token");
    const refreshClient = createRefreshClient();
    const { data, errors } = await refreshClient.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refresh_token },
    });
    if (
      errors &&
      errors.length > 0 &&
      errors[0].extensions?.code === STATUS_CODE.FORBIDDEN
    ) {
      Cookies.remove("Authorization");
      Cookies.remove("Refresh_Token");
    }
    if (data.refreshToken?.success) {
      return true; // 刷新成功
    } else {
      throw new Error(errors?.[0].message);
    }
  } catch (error) {
    throw error; // 抛给 reject 处理
  }
};

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    // 为了在网络错误时重试，推荐使用 RetryLink，而不是onError链接。这只是为了记录错误。
    // https://www.apollographql.com/docs/react/api/link/apollo-link-retry
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      toast.error(networkError.message);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions?.code) {
          // Apollo Server 将代码设置为未认证
          // 当在解析器中抛出 AuthenticationError 时
          case STATUS_CODE.UNAUTHENTICATED:
            const hasAuthCookie = Cookies.get("Authorization");
            if (!hasAuthCookie) {
              // 如果没有登录态则不做处理
              return;
            }
            // 修改 operation.context 为新的token
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
              },
            });
            // 当 token 过期时
            if (!isRefreshing) {
              isRefreshing = true;
              // 刷新token
              refreshTokenFn()
                .then((success) => {
                  // 成功刷新 token 后，处理所有等待的请求
                  processQueue(success);
                })
                .catch((error) => {
                  toast.error(error.message);
                  // 刷新失败，以 false 处理所有等待的请求
                  processQueue(false);
                })
                .finally(() => {
                  isRefreshing = false;
                });
            }
            // 返回一个新的可观察对象，等待 token 刷新后重试
            return new Observable((observer) => {
              // ⌛️将当前请求添加到等待队列
              pendingRequests.push((success: boolean) => {
                if (success) {
                  // 重新执行请求，此时新的 cookie 已经设置
                  forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  });
                } else {
                  // 刷新失败，抛出错误
                  observer.error(new Error("Refresh token failed"));
                }
              });
            });
          case STATUS_CODE.FORBIDDEN:
            console.error("Access denied. User does not have permissions.");
            break;
          case STATUS_CODE.INTERNAL_SERVER_ERROR:
            console.error("Internal server error:", err);
            toast.error(err.message);
            break;
          default:
            console.error("Unhandled GraphQL error:", err);
        }
      }
    }
  }
);

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GQL_SERVICE_URL,
  credentials: "include",
});

// 使用 Cookie 的形式不需要手动设置 Authorization
const authLink = new ApolloLink((operation, forward) => {
  // operation.setContext((previousContext: DefaultContext) => ({
  //   headers: {
  //     ...previousContext.headers,
  //     // authorization: `Bearer ${localStorage.getItem('token')}`
  //   },
  // }));
  return forward(operation);
});

export const gqlClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
