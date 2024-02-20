'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { useLabFilter } from './useLabFilter';

type Props = {};

const LabFilterInput = (props: Props) => {
  const { setSearch } = useLabFilter();
  return (
    <div className="flex shrink-0 items-center gap-2 py-4">
      <Label className="min-w-fit" htmlFor="lab-filter">
        客戶:
      </Label>
      <Input
        className="rounded-none border-primary"
        id="lab-filter"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default LabFilterInput;
