"use client";
import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/utils/styles";
import { X as CloseX, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/graphql/actions/login.action";
import toast from "react-hot-toast";
import { encrypt } from "@/utils/encrypt";
import useUserInfo from "@/hooks/useUserInfo";
import { useUserStore } from "@/stores/userStore";
import { AuthModes } from "@/screens/AuthScreen";

type LoginProps = {
  closeScreen: (nextValue?: any) => void;
  switchAuthMode: Dispatch<SetStateAction<AuthModes>>;
};

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = (props: LoginProps) => {
  const { closeScreen, switchAuthMode } = props;
  const initUser = useUserStore((state) => state.initUser);
  const t = useTranslations("LoginModal");
  const _t = useTranslations("FormValidationErrorPrompt");
  const tError = useTranslations("ServerErrorPage");
  const [show, setShow] = useState(false);

  const { getUserInfo } = useUserInfo();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Tab" &&
        event.target instanceof HTMLElement &&
        event.target.id === "modal-close"
      ) {
        event.preventDefault();
        const focusableElements =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = document.getElementById("screen");
        const focusableContent = modal?.querySelectorAll(focusableElements);
        const focusableArray = Array.prototype.slice.call(focusableContent);
        const index = focusableArray.indexOf(event.target);

        if (
          focusableArray[index].getAttribute("data-focus-visible") === "true"
        ) {
          focusableArray[index].removeAttribute("data-focus-visible");
          focusableArray[index + 1].focus();
        } else {
          focusableArray[0].setAttribute("data-focus-visible", "true");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onSubmit: SubmitHandler<LoginSchema> = async (data: LoginSchema) => {
    // 对 password 进行加密
    const encryptPassword = encrypt(data.password);
    try {
      const { data: result } = await loginMutation({
        variables: {
          email: data.email,
          password: encryptPassword,
        },
      });
      if (result.login.code === 200) {
        toast.success(t("loginSuccess"));
        const resp = await getUserInfo();
        const detail = resp.data.getUserDetail;
        if (detail) {
          initUser(detail);
        }
        closeScreen();
      } else {
        toast.error(tError("description"));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(t("loginError"));
    }
    resetField("password");
  };

  return (
    <section
      tabIndex={-1}
      className="flex flex-col relative z-50 w-full box-border dark:bg-slate-900 bg-background outline-none mx-1 my-1 sm:mx-6 sm:my-16 max-w-lg rounded-large shadow-small overflow-y-hidden"
    >
      <button
        tabIndex={0}
        id="modal-close"
        className="btn-close"
        role="button"
        aria-label="Close"
        aria-hidden="false"
        type="button"
        onClick={closeScreen}
      >
        <CloseX size={20} />
      </button>
      <header className="py-4 px-6 flex-initial text-large font-semibold flex flex-col gap-1">
        {t("header")}
      </header>
      <div className="px-4 py-6 flex flex-col">
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full">
            <label className={`${styles.label}`}>{t("email")}</label>
            <input
              {...register("email")}
              type="email"
              placeholder="example@gmail.com"
              className={`${styles.input}`}
            />
            {errors.email && (
              <span className="text-red-500 block mt-1">{`${_t(
                "invalidEmail"
              )}`}</span>
            )}
          </div>
          <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
              {t("password")}
            </label>
            <input
              {...register("password")}
              type={show ? "text" : "password"}
              placeholder="password!@%"
              className={`${styles.input}`}
            />
            {!show ? (
              <EyeOff
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShow(true)}
              />
            ) : (
              <Eye
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShow(false)}
              />
            )}
          </div>
          {errors.password && (
            <span className="text-red-500">{`${_t("passwordLength")}`}</span>
          )}
          <div className="w-full mt-5">
            <span
              className={`text-[16px] font-Poppins text-[#2190ff] block text-right cursor-pointer`}
              onClick={() => switchAuthMode(AuthModes.ResetPassword)}
            >
              {t("resetPassword")}
            </span>
            <br />
            <button
              type="submit"
              className={`${styles.button}`}
              disabled={isSubmitting}
            >
              {isSubmitting || loading ? (
                <Loader2 className="animate-spin mr-1" />
              ) : null}
              {t("login")}
            </button>
          </div>
          <h5 className="text-center pt-4 font-Poppins text-[16px]">
            {t("orJoinWith")}
          </h5>
          <div className="flex items-center justify-center my-3 space-x-4">
            <div className="w-8 h-8 cursor-pointer">
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="#EA4335"
              >
                <title>Gmail</title>
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
              </svg>
            </div>
            <div className="w-8 h-8 cursor-pointer">
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </div>
          </div>
          <h5 className="text-center pt-4 font-Poppins text-[14px]">
            {t("notAccount")}
            <span
              className="text-[#2190ff] pl-1 cursor-pointer"
              onClick={() => switchAuthMode(AuthModes.Signup)}
            >
              {t("signUp")}
            </span>
          </h5>
          <br />
        </form>
      </div>
    </section>
  );
};

export default Login;
