import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
};
const LoadingSpinner: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={twMerge(
        'm-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        className,
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';
export default LoadingSpinner;
