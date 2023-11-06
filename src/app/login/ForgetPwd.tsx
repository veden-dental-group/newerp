import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Props = {
  showForget: boolean;
  setShowForget: Dispatch<SetStateAction<boolean>>;
};

const ForgetPwd: React.FC<Props> = ({ showForget, setShowForget }) => {
  return (
    <div
      id="forget-form"
      className={`${
        showForget ? 'translate-x-[100%] md:translate-x-[82%]' : 'translate-x-0 md:translate-x-[-20%]'
      } absolute left-[-100%] z-10 flex h-full w-full flex-col items-center justify-evenly transition-all duration-700 md:left-[0] md:w-[55%]`}
    >
      <div className="flex w-full items-start px-4 md:px-10">
        <Image
          alt="backward"
          className="h-14 w-14 cursor-pointer p-4 hover:opacity-75"
          src="/img/loginpage/back.svg"
          width="22"
          height="19"
          onClick={() => setShowForget(false)}
        />
      </div>
      <div className="text-center text-2xl text-primary md:text-4xl">Forget Password</div>
      <form className="flex h-20 flex-col items-center justify-between md:h-24">
        <span className="w-full pl-2 text-left text-xs text-primary md:text-sm">
          Enter your registration email to get the recover link
        </span>
        <div className="flex h-12 w-[20rem] items-center rounded-lg bg-secondary drop-shadow-inputs md:h-[3.75rem] md:w-[26rem]">
          <Image alt="mail" className="h-14 w-14 p-4" src="/img/loginpage/icon-email.svg" width="24" height="24" />
          <input
            type="text"
            id="mail"
            name="mail"
            className="w-full border-none bg-transparent pr-4 text-lg outline-none md:text-xl"
            placeholder="Email"
            required
          />
        </div>
      </form>
      <Button variant="filled" size="md" className="relative text-xl font-bold">
        Send
      </Button>
      <span className="text-lightgray w-[20rem] pb-12 pl-2 text-left text-sm md:w-[26rem]">
        If you forget your registration email, please contact our customer service directly.
      </span>
    </div>
  );
};
export default ForgetPwd;
