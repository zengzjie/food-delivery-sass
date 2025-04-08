"use client";
import { useLayoutEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/utils/styles";
import { X as CloseX, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLazyQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { useUserStore } from "@/stores/userStore";
import { RESET_PASSWORD_QUERY } from "@/graphql/actions/resetPassword";

type ResetPasswordProps = {
  closeScreen: (nextValue?: any) => void;
  switchLogin: () => void;
};

const formSchema = z.object({
  email: z.string().email(),
});

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPassword = (props: ResetPasswordProps) => {
  const { closeScreen, switchLogin } = props;
  const initUser = useUserStore((state) => state.initUser);
  const t = useTranslations("ResetPasswordModal");
  const _t = useTranslations("FormValidationErrorPrompt");

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const [resetPassword, { loading }] =
    useLazyQuery(RESET_PASSWORD_QUERY);

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

  const onSubmit: SubmitHandler<ResetPasswordSchema> = async (
    data: ResetPasswordSchema
  ) => {
    try {
      const { data: result } = await resetPassword({
        variables: {
          email: data.email,
        },
      });
      if (result?.resetPassword.code === 200) {
        toast.success(t("successMsg"));
        resetField("email");
        closeScreen();
      }
    } catch (error: any) {
      console.error(error);
    }
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
          <div className="w-full mt-5">
            <button
              type="submit"
              className={`${styles.button}`}
              disabled={isSubmitting}
            >
              {isSubmitting || loading ? (
                <Loader2 className="animate-spin mr-1" />
              ) : null}
              {t("header")}
            </button>
          </div>
          <h5 className="text-center pt-4 font-Poppins text-[14px]">
            {t("tip")}
            <span
              className="text-[#2190ff] pl-1 cursor-pointer"
              onClick={switchLogin}
            >
              {t("login")}
            </span>
          </h5>
          <br />
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
