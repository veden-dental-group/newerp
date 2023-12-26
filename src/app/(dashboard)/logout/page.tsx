'use client';
import { signOut } from 'next-auth/react';

type Props = {};

const Logout = (props: Props) => {
  signOut({
    callbackUrl: '/login',
  });
};

export default Logout;
