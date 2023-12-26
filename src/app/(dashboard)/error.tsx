'use client';
import React from 'react';

type Props = {
  error: Error;
  reset: () => void;
};

const InquiryError: React.FC<Props> = ({ error, reset }) => {
  return <div>{error.message}</div>;
};

export default InquiryError;
