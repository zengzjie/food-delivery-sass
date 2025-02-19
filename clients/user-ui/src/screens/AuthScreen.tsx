import Login from "../shared/Auth/Login";

type AuthScreenProps = {
  toggleScreen: (nextValue?: any) => void;
};

const AuthScreen = (props: AuthScreenProps) => {
  const { toggleScreen } = props;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLDivElement &&
      e.target.parentElement?.id === "screen"
    ) {
      toggleScreen(false);
    }
  };

  return (
    <div tabIndex={-1}>
      <div
        id="screen"
        className="z-[100] bg-overlay/50 backdrop-opacity-disabled w-screen h-screen fixed inset-0"
        onClick={handleClose}
      >
        <div
          style={
            {
              "--visual-viewport-height": "758px",
              transform:
                "translateY(var(--slide-enter)) scale(var(--scale-enter))",
            } as any
          }
          className="flex w-screen fixed inset-0 z-50 overflow-x-auto justify-center h-[--visual-viewport-height] items-end sm:items-center [--scale-enter:100%] [--scale-exit:100%] [--slide-enter:0px] [--slide-exit:80px] sm:[--scale-enter:100%] sm:[--scale-exit:103%] sm:[--slide-enter:0px] sm:[--slide-exit:0px]"
        >
          <Login closeScreen={() => toggleScreen(false)} />
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
