import { DateRangePicker } from '@/components/ui/daterangepicker';
import { Input } from '@/components/ui/input';
import React from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import TableHeaderContainer from '@/components/table/TableHeaderContainer';
import TableHeaderOption from '@/components/table/TableHeaderOption';
import { Form } from '@/components/ui/form';
import { asOptionalField } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

type Props = {
  submitHandler: (value: HeaderForm) => void;
};

const formSchema = z.object({
  date: z.object({ from: z.date().optional(), to: z.date().optional() }),
  rx: asOptionalField(z.string()),
});

export type HeaderForm = z.infer<typeof formSchema>;
export const HeaderFormDefaultValue: HeaderForm = { date: { from: undefined, to: undefined }, rx: '' };

const Header: React.FC<Props> = ({ submitHandler }) => {
  const form = useForm<HeaderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: HeaderFormDefaultValue,
  });

  return (
    <Form {...form}>
      <TableHeaderContainer onClick={form.handleSubmit(submitHandler)}>
        <TableHeaderOption option="date" control={form.control}>
          {(field) => (
            <DateRangePicker field={field} className="text-primary" resetDate={() => form.resetField('date')} />
          )}
        </TableHeaderOption>
        <TableHeaderOption option="rx" control={form.control}>
          {(field) => (
            <Input
              type="text"
              placeholder={'rx'}
              className="mr-2 rounded-md bg-white text-base text-primary placeholder:text-primary/50"
              {...field}
            />
          )}
        </TableHeaderOption>
      </TableHeaderContainer>
    </Form>
  );
};
export default Header;
