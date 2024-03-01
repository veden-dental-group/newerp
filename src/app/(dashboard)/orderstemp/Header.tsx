import { asOptionalField } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useCustomerList } from '@/features/customer/getCustomers';

import LoadingSpinner from '@/components/LoadingSpinner';
import TableHeaderContainer from '@/components/table/TableHeaderContainer';
import TableHeaderOption from '@/components/table/TableHeaderOption';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DateRangePicker } from '@/components/ui/daterangepicker';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { GrSend } from 'react-icons/gr';
import { PiCaretUpDownBold } from 'react-icons/pi';
import { MdLocalParking } from 'react-icons/md';

import { twMerge } from 'tailwind-merge';

type Props = {
  submitHandler: (value: HeaderForm) => void;
  btnRef?: React.Ref<HTMLButtonElement>;
};

const formSchema = z.object({
  date: z.object({ from: z.date().optional(), to: z.date().optional() }),
  rx: asOptionalField(z.string()),
  filename: asOptionalField(z.string()),
  customer: asOptionalField(z.number()),
});

export type HeaderForm = z.infer<typeof formSchema>;
export const HeaderFormDefaultValue: HeaderForm = {
  date: { from: new Date(), to: undefined },
  rx: '',
  filename: '',
  customer: undefined,
};

const Header: React.FC<Props> = ({ submitHandler, btnRef }) => {
  const form = useForm<HeaderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: HeaderFormDefaultValue,
  });
  const { data: customers, isPending, isError } = useCustomerList();

  const handelManualCreateMany = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const res = await fetch('/api/csp/orderstemp/manualCreateMany', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderdate: form.getValues('date.from') }),
      });
      console.log(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleNoticePLS = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const res = await fetch('/api/csp/arrivalNotice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderdate: form.getValues('date.from') }),
      });
      console.log(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <TableHeaderContainer onClick={form.handleSubmit(submitHandler)} btnRef={btnRef}>
        <TableHeaderOption option="date" control={form.control} label="日期">
          {(field) => (
            <DateRangePicker
              field={field}
              className="text-primary"
              resetDate={() => form.setValue('date', { from: undefined, to: undefined })}
            />
          )}
        </TableHeaderOption>
        <TableHeaderOption option="rx" control={form.control} label="RX">
          {(field) => (
            <Input
              type="text"
              placeholder={'rx'}
              className="mr-2 w-48 rounded-md bg-white text-sm text-primary placeholder:text-primary/50"
              {...field}
            />
          )}
        </TableHeaderOption>
        <TableHeaderOption option="filename" control={form.control} label="檔名">
          {(field) => (
            <Input
              type="text"
              placeholder={'...'}
              className="mr-2 w-48 rounded-md bg-white text-sm text-primary placeholder:text-primary/50"
              {...field}
            />
          )}
        </TableHeaderOption>
        <TableHeaderOption option="customer" control={form.control} label="客戶">
          {(field) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="customer"
                  variant="secondary"
                  role="combobox"
                  className={twMerge('w-48 justify-between bg-white', !field.value && 'text-black')}
                >
                  {isPending ? (
                    <LoadingSpinner className="h-4 w-4 border-2" />
                  ) : field.value && customers ? (
                    customers.find((customer) => customer.CUSTOMER_ID === field.value)?.CUSTOMER_SHORT_NAME
                  ) : (
                    'Select Your Lab'
                  )}
                  {field.value ? (
                    <IoClose className="hover:scale-105 hover:opacity-60" onClick={() => form.resetField('customer')} />
                  ) : (
                    <PiCaretUpDownBold />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <Command>
                  <CommandInput placeholder="Search" className="h-9" />
                  <CommandEmpty>Not found</CommandEmpty>
                  <CommandList>
                    {isPending ? (
                      <div className="flex justify-center">
                        <LoadingSpinner />
                      </div>
                    ) : (
                      customers &&
                      customers.map((customer) => {
                        return (
                          <CommandItem
                            className="flex justify-between"
                            key={customer.CUSTOMER_ID}
                            value={customer.CUSTOMER_SHORT_NAME}
                            onSelect={() => {
                              form.setValue('customer', customer.CUSTOMER_ID);
                            }}
                          >
                            {customer.CUSTOMER_SHORT_NAME}
                            {customer.CUSTOMER_ID === field.value && <FaCheck />}
                          </CommandItem>
                        );
                      })
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </TableHeaderOption>
        <Button variant={'pureIcon'} size={'icon'} onClick={handelManualCreateMany}>
          <GrSend className="h-10 w-10 shrink-0 cursor-pointer rounded-md bg-destructive p-2 text-white hover:bg-destructive/50" />
        </Button>
        <Button variant={'pureIcon'} size={'icon'} onClick={handleNoticePLS}>
          <MdLocalParking className="h-10 w-10 shrink-0 cursor-pointer rounded-md bg-primary p-2 text-white hover:bg-primary/50" />
        </Button>
      </TableHeaderContainer>
    </Form>
  );
};
export default Header;
