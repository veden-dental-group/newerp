"use client";
import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import ForgetPwd from "./ForgetPwd";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Login() {
  const [toggle, setToggle] = useState(false);
  const [showForget, setShowForget] = useState(false);
  const session = useSession();
  if (session?.data?.user) redirect("/home");
  useEffect(() => {
    if (toggle == false) setShowForget(false);
  }, [toggle]);

  return (
    <div
      id="login-extend"
      className="flex h-[calc(100dvh)] w-full justify-center bg-secondary"
    >
      <div
        id="main"
        className="container relative flex h-full w-[75rem] flex-row items-center overflow-hidden px-0 py-6 drop-shadow-container md:py-24"
      >
        <div
          id="welcome-block"
          className={`${
            toggle
              ? "translate-x-[-100%] rounded-s-2xl md:w-[45%] md:translate-x-0"
              : "w-[100%] translate-x-0 rounded-2xl"
          } absolute inset-0 z-20 my-6 flex flex-col items-center justify-evenly bg-primary transition-all duration-700 md:my-24`}
        >
          <div className="flex flex-col text-left text-3xl text-white md:text-4xl">
            <span className="mb-8">Welcome to</span>
            <span>Veden Customer Portal</span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="md"
              className="relative text-xl font-bold"
              onClick={() => setToggle(!toggle)}
            >
              SIGN IN
            </Button>
          </div>
        </div>
        <div
          id="form-block"
          className="relative h-full w-[100%] rounded-2xl bg-white"
        >
          <LoginForm showForget={showForget} setShowForget={setShowForget} />
          <ForgetPwd showForget={showForget} setShowForget={setShowForget} />
        </div>
      </div>
    </div>
  );
}
