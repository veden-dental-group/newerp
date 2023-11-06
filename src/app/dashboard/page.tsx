"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {};

const DashboardPage = (props: Props) => {
  return (
    <div>
      <Link href={"/query"}>Query</Link>
      <Button
        onClick={() => {
          signOut();
          redirect("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default DashboardPage;
