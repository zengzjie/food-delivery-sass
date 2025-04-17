"use client";

import { use, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/utils/styles";
import { X as CloseX, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { EXECUTE_PASSWORD_RESET } from "@/graphql/actions/executePasswordReset.action";
import { encrypt } from "@/utils/encrypt";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const ResetPasswordPage = (props: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { searchParams } = props;
  const queryParameters = use(searchParams);
  const t = useTranslations("ResetPasswordModal");
  const _t = useTranslations("FormValidationErrorPrompt");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const formSchema = z
    .object({
      password: z.string().min(8, {
        message: "passwordMinLength",
      }),
      confirmPassword: z.string().min(8, {
        message: "passwordMinLength",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: _t("passwordNotMatch"),
    });

  type ResetPasswordSchema = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const [passwordResetMutation, { loading }] = useMutation(
    EXECUTE_PASSWORD_RESET
  );

  const onSubmit: SubmitHandler<ResetPasswordSchema> = async (
    data: ResetPasswordSchema
  ) => {
    const encryptPassword = encrypt(data.password);
    try {
      const { data: result } = await passwordResetMutation({
        variables: {
          password: encryptPassword,
          token: queryParameters.token,
        },
      });
      if (result?.executePasswordReset.code === 200) {
        reset();
        toast.success(t("successReset"), {
          duration: 2000,
        });
        setTimeout(() => {
          window.close();
        }, 2000);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div
      id="screen"
      className="z-[100] bg-overlay/50 backdrop-opacity-disabled w-screen h-screen absolute inset-0 flex justify-center items-center"
    >
      <div
        style={
          {
            "--visual-viewport-height": "100vh",
            transform:
              "translateY(var(--slide-enter)) scale(var(--scale-enter))",
          } as any
        }
        className="flex w-full max-w-md mx-auto z-50 overflow-hidden justify-center h-[--visual-viewport-height] items-center sm:px-4 sm:w-auto sm:mx-auto [--scale-enter:100%] [--scale-exit:100%] [--slide-enter:0px] [--slide-exit:80px] sm:[--scale-enter:100%] sm:[--scale-exit:103%] sm:[--slide-enter:0px] sm:[--slide-exit:0px]"
      >
        <section
          tabIndex={-1}
          className="flex flex-col relative z-50 w-full box-border dark:bg-slate-900 bg-background outline-none mx-1 my-1 sm:mx-6 sm:my-16 max-w-lg rounded-large shadow-small overflow-y-hidden"
        >
          <header className="py-4 px-6 flex-initial text-large font-semibold flex flex-col gap-1">
            {t("header")}
          </header>
          <div className="px-4 py-6 flex flex-col">
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full relative mb-1">
                <label htmlFor="password" className={`${styles.label}`}>
                  {t("password")}
                </label>
                <input
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  placeholder="password!@%"
                  className={`${styles.input}`}
                />
                {!showPwd ? (
                  <EyeOff
                    className="absolute bottom-3 right-2 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShowPwd(true)}
                  />
                ) : (
                  <Eye
                    className="absolute bottom-3 right-2 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShowPwd(false)}
                  />
                )}
              </div>
              {errors.password && (
                <span className="text-red-500">{`${_t(
                  "passwordLength"
                )}`}</span>
              )}
              <div className="w-full mt-5 relative mb-1">
                <label htmlFor="confirmPassword" className={`${styles.label}`}>
                  {t("confirmPassword")}
                </label>
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPwd ? "text" : "password"}
                  placeholder="password!@%"
                  className={`${styles.input}`}
                />
                {!showConfirmPwd ? (
                  <EyeOff
                    className="absolute bottom-3 right-2 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShowConfirmPwd(true)}
                  />
                ) : (
                  <Eye
                    className="absolute bottom-3 right-2 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShowConfirmPwd(false)}
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500">{`${_t(
                  "passwordNotMatch"
                )}`}</span>
              )}
              <div className="w-full mt-5">
                <button
                  type="submit"
                  className={`${styles.button}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting || loading ? (
                    <Loader2 className="animate-spin mr-1" />
                  ) : null}
                  {t("submit")}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
