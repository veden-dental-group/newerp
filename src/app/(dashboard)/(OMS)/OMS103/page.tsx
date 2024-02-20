import React from 'react';
import LabFilter from './LabFilter';
import { LabFilterContextProvider } from './useLabFilter';
import { Button } from '@/components/ui/button';
import HabitsSelect from './HabitsSelect';
import ProductHabit from './ProductHabit';

type Props = {
  searchParams: {
    id: string;
  };
};

const page = ({ searchParams }: Props) => {
  return (
    <LabFilterContextProvider>
      <div className="m-4 flex h-[calc(100dvh-2rem)] gap-4 border-2 border-primary p-4">
        <LabFilter />
        <div className="flex flex-1 flex-col gap-4 pt-4">
          <div className="flex gap-2">
            <Button className="rounded-none border-primary" variant={'outline'}>
              新增
            </Button>
            <Button className="rounded-none border-primary" variant={'outline'}>
              修改
            </Button>
            <Button className="rounded-none border-primary" variant={'outline'}>
              刪除
            </Button>
            <Button className="rounded-none border-primary" variant={'outline'}>
              複製
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-4 border-2 border-primary p-4">
            <div className="border-2 border-primary p-4">
              <HabitsSelect customerId={searchParams.id} />
            </div>
            <div className="h-1 grow overflow-y-auto border-2 border-primary p-4">
              <ProductHabit customerId={searchParams.id} />
            </div>
            <div className="h-1 grow border-2 border-primary"></div>
          </div>
        </div>
      </div>
    </LabFilterContextProvider>
  );
};

export default page;
