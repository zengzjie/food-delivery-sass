import { useState } from "react";
import ReactDOM from "react-dom";
import Login from "../shared/Auth/Login";
import Signup from "@/shared/Auth/Signup";
import Verification from "@/shared/Auth/Verification";
import ResetPassword from "@/shared/Auth/ResetPassword";

type AuthScreenProps = {
  toggleScreen: (nextValue?: any) => void;
};

export enum AuthModes {
  Login = "LOGIN",
  Signup = "SIGNUP",
  Verification = "VERIFICATION",
  ResetPassword = "RESET_PASSWORD",
}

const AuthScreen = (props: AuthScreenProps) => {
  const { toggleScreen } = props;
  const [authMode, setAuthMode] = useState<AuthModes>(AuthModes.Login);
  const [activationToken, setActivationToken] = useState<string>("");

  const handleNeedCaptcha = (activationToken: string) => {
    setActivationToken(activationToken);
    setAuthMode(AuthModes.Verification);
  };

  const modalContent = (
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
        className="flex w-full max-w-md mx-auto z-50 overflow-hidden justify-center h-[--visual-viewport-height] items-center sm:w-auto sm:mx-auto [--scale-enter:100%] [--scale-exit:100%] [--slide-enter:0px] [--slide-exit:80px] sm:[--scale-enter:100%] sm:[--scale-exit:103%] sm:[--slide-enter:0px] sm:[--slide-exit:0px]"
      >
        {authMode === AuthModes.Login ? (
          <Login
            closeScreen={() => toggleScreen(false)}
            switchAuthMode={setAuthMode}
          />
        ) : authMode === AuthModes.Signup ? (
          <Signup
            closeScreen={() => toggleScreen(false)}
            switchAuthMode={setAuthMode}
            needCaptcha={handleNeedCaptcha}
          />
        ) : authMode === AuthModes.Verification ? (
          <Verification
            activationToken={activationToken}
            closeScreen={() => toggleScreen(false)}
            switchLogin={() => setAuthMode(AuthModes.Login)}
          />
        ) : (
          <ResetPassword
            closeScreen={() => toggleScreen(false)}
            switchLogin={() => setAuthMode(AuthModes.Login)}
          />
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AuthScreen;
