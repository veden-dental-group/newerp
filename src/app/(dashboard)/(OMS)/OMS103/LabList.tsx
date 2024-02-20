'use client';
import React from 'react';
import { useLabFilter } from './useLabFilter';
import { CustomerHeaderDTO } from './LabFilter';

type Props = {
  labs: CustomerHeaderDTO[];
};

const LabList = ({ labs }: Props) => {
  const { search } = useLabFilter();
  return (
    <div className="grow overflow-y-auto border-2 border-primary p-2">
      {labs.map((el) => {
        if (new RegExp(search).test(el.CUSTOMER_CODE)) {
          return (
            <div key={el.CUSTOMER_ID} className="flex gap-4">
              <span>{el.CUSTOMER_CODE}</span>
              <span>{el.CUSTOMER_SHORT_NAME}</span>
            </div>
          );
        }
      })}
    </div>
  );
};

export default LabList;
