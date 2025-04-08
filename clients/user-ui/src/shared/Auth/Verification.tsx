import { ACTIVATE_USER_MUTATION } from "@/graphql/actions/activateUser.action";
import { useMutation } from "@apollo/client";
import { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { X as CloseX, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "@/utils/styles";

interface VerificationProps {
  activationToken: string;
  closeScreen: () => void;
  switchLogin: () => void;
}

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
};

const Verification = (props: VerificationProps) => {
  const { activationToken: activation_token, closeScreen, switchLogin } = props;
  const t = useTranslations("SignUpModal");
  const tError = useTranslations("ServerErrorPage");
  const [activateUserMutation, { loading }] = useMutation<
    any,
    { activation_token: string; activation_code: string }
  >(ACTIVATE_USER_MUTATION);
  const [invalidError, setInvalidError] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");

    if (verificationNumber.length !== 6) {
      setInvalidError(true);
      return;
    } else {
      const data = {
        activation_token,
        activation_code: verificationNumber,
      };
      try {
        const { data: result } = await activateUserMutation({
          variables: data,
        });
        if (result.activateUser.code === 200) {
          toast.success(t("captchaSuccess"));
          switchLogin();
        } else {
          toast.error(tError("description"));
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 5) {
      inputRefs[index + 1].current?.focus();
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

      <h1 className={`${styles.title}`}>{t("captchaTitle")}</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <ShieldCheck size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around gap-2">
        {Object.keys(verifyNumber).map((key, index) => {
          return (
            <input
              type="number"
              key={key}
              ref={inputRefs[index]}
              className={`w-[65px] h-[65px] bg-transparent border-[2px] rounded-[10px] flex items-center text-white justify-center text-[18px] font-Poppins outline-none text-center ${
                invalidError ? "shake border-red-500" : "border-white"
              }`}
              placeholder=""
              maxLength={1}
              value={verifyNumber[key as keyof VerifyNumber]}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          );
        })}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center px-4">
        <button
          className={`${styles.button}`}
          disabled={loading}
          onClick={verificationHandler}
        >
          {loading ? <Loader2 className="animate-spin mr-1" /> : null}
          {t("captchaOTP")}
        </button>
      </div>
      <br />
      <h5 className="text-center pb-4 font-Poppins text-[14px] text-white">
        {t("goBackToSignIn")}
        <span
          className="text-[#2190ff] pl-1 cursor-pointer"
          onClick={switchLogin}
        >
          {t("signIn")}
        </span>
      </h5>
    </section>
  );
};

export default Verification;
