"use client";
import { useLayoutEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/utils/styles";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { X as CloseX } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type LoginProps = {
  closeScreen: (nextValue?: any) => void;
};

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = (props: LoginProps) => {
  const { closeScreen } = props;
  const t = useTranslations("LoginModal");
  const _t = useTranslations("FormValidationErrorPrompt");
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

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

  const onSubmit: SubmitHandler<LoginSchema> = (data: LoginSchema) => {
    console.log("\n 🎯-> checked onSubmit checked data: 📮 --- 📮", data);
    reset();
  };

  const handleCloseAuthScreen = () => {
    closeScreen();
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
        onClick={handleCloseAuthScreen}
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
              type="password"
              placeholder="password!@%"
              className={`${styles.input}`}
            />
            {!show ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShow(true)}
              />
            ) : (
              <AiOutlineEye
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
            >
              {t("forgotPassword")}
            </span>
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting}
              className="w-full mt-3 border-[#e5e7eb] border-1 dark:bg-slate-900"
            >
              {t("login")}
            </Button>
          </div>
          <br />
          <h5 className="text-center pt-4 font-Poppins text-[16px]">
            {t("orJoinWith")}
          </h5>
          <div
            className="flex items-center justify-center my-3"
            onClick={() => {}}
          >
            <FcGoogle size={30} className="cursor-pointer mr-2" />
            <AiFillGithub size={30} className="cursor-pointer" />
          </div>
          <h5 className="text-center pt-4 font-Poppins text-[14px]">
            {t("notAccount")}
            <span
              className="text-[#2190ff] pl-1 cursor-pointer"
              onClick={() => {}}
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
