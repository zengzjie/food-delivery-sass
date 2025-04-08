import { IUserInfo } from "@/hooks/useUserInfo";
import { StoreApi, create } from "zustand";
import { NamedSet, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type UserStore<T> = {
  user: T | null;
  initUser: (data: T) => void;
};

const initUser = <T>(
  set: NamedSet<UserStore<T>>,
  get: StoreApi<UserStore<T>>["getState"],
  data: T
) => {
  const user = get().user;
  console.log("data => ", data);

  set((state) => {
    state.user = { ...user, ...data };
    return state;
  });
};

export const useUserStore = create(
  immer(
    devtools<UserStore<IUserInfo>>(
      (set, get) => {
        return {
          user: null,
          initUser: (data) => initUser(set, get, data),
        };
      },
      {
        enabled: process.env.NODE_ENV === "development",
        name: "useUserStore",
      }
    )
  )
);
