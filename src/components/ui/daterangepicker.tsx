'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ControllerRenderProps } from 'react-hook-form';

type Props = {
  className?: string;
  field: ControllerRenderProps<any>;
  resetDate: () => void;
};

const DateRangePicker: React.FC<Props> = ({ className, field, resetDate }) => {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn('w-[300px] justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value?.from ? (
              field.value.to ? (
                <>
                  {format(field.value.from, 'yyyy-MM-dd')} ~ {format(field.value.to, 'yyyy-MM-dd')}
                </>
              ) : (
                format(field.value.from, 'yyyy-MM-dd')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={field.value?.from}
            selected={field.value}
            onSelect={(e) => field.onChange(e)}
            numberOfMonths={2}
          />
          <div className="flex w-full gap-2 px-6 pb-6">
            <Button size="sm" variant="default" onClick={resetDate}>
              RESET
            </Button>
            <Button size="sm" variant="default" onClick={() => field.onChange({ from: new Date(), to: undefined })}>
              TODAY
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
