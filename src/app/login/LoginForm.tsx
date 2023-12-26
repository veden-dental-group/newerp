import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  showForget: boolean;
  setShowForget: Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

const LoginForm: React.FC<Props> = ({ showForget, setShowForget }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await signIn('credentials', { ...values, redirect: false, callbackUrl: '/home' });
      if (!res) throw new Error('credentials api crashed.');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form {...form}>
      <form
        className={`${
          showForget ? "translate-x-[100%]" : "translate-x-0"
        } absolute z-10 flex h-full w-full flex-col items-center justify-evenly transition-all duration-700 md:left-[45%] md:w-[55%]`}
        onSubmit={form.handleSubmit(loginHandler)}
      >
        <Image
          alt="logo"
          className="mt-6 h-20 w-[14rem] md:mt-12"
          src="/img/veden_logo.png"
          width="224"
          height="80"
          priority
        />
        <div className="text-center text-2xl text-primary md:text-4xl">
          Login Your Account
        </div>
        <div className="flex h-28 flex-col items-center justify-between md:h-36">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-12 w-[20rem] items-center rounded-lg bg-secondary drop-shadow-inputs md:h-[3.75rem] md:w-[26rem]">
                  <Image
                    alt="account"
                    className="h-14 w-14 p-4"
                    src="/img/loginpage/icon-account.svg"
                    width="22"
                    height="24"
                  />
                  <FormControl>
                    <Input
                      className="w-full border-none bg-transparent pr-4 text-lg outline-none md:text-xl"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="-translate-y-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-12 w-[20rem] items-center rounded-lg bg-secondary drop-shadow-inputs md:h-[3.75rem] md:w-[26rem]">
                  <Image
                    alt="password"
                    className="h-14 w-14 p-4"
                    src="/img/loginpage/icon-password.svg"
                    width="24"
                    height="25"
                  />
                  <FormControl>
                    <Input
                      type="password"
                      className="w-full border-none bg-transparent pr-4 text-lg outline-none md:text-xl"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="-translate-y-2" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex h-16 w-full flex-col items-center justify-evenly md:h-20 md:w-[20rem] md:items-start">
          <div className="flex flex-nowrap items-center">
            <Image
              alt="checkicon"
              className="h-6 w-6"
              src="/img/loginpage/icon-check.svg"
              width="31"
              height="31"
            />
            <span className="text-lightgray pl-2 text-left text-sm">
              Remember Me
            </span>
          </div>
          <div className="flex flex-nowrap items-center">
            <span className="text-lightgray text-left text-sm">
              Forget Your Password ?{" "}
            </span>
            <span
              className="cursor-pointer pl-2 text-left text-sm text-primary hover:underline"
              onClick={() => setShowForget(true)}
            >
              Recover It Here
            </span>
          </div>
        </div>
        <Button
          variant="filled"
          size="md"
          className="relative mb-6 text-xl font-bold md:mb-12"
          type="submit"
        >
          SUBMIT
        </Button>
      </form>
    </Form>
  );
};
export default LoginForm;
