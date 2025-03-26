import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import LabSelect from '@/components/LabSelect';
import TableHeaderContainer from '@/components/table/TableHeaderContainer';
import TableHeaderOption from '@/components/table/TableHeaderOption';
import { DateRangePicker } from '@/components/ui/daterangepicker';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { asOptionalField } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  submitHandler: (value: HeaderForm) => void;
  btnRef?: React.Ref<HTMLButtonElement>;
};

const formSchema = z.object({
  date: z.object({ from: z.date().optional(), to: z.date().optional() }),
  rx: asOptionalField(z.string()),
  filename: asOptionalField(z.string()),
  customer: asOptionalField(z.string()),
  orderstatus: asOptionalField(z.string()),
  orderstyle: asOptionalField(z.string()),
  serial: asOptionalField(z.string()),
});

export type HeaderForm = z.infer<typeof formSchema>;
export const HeaderFormDefaultValue: HeaderForm = {
  date: { from: new Date(), to: undefined },
  rx: '',
  filename: '',
  customer: undefined,
  orderstatus: 'All',
  orderstyle: 'All',
  serial: '',
};

const statusOptions = [
  { name: 'All', value: 'All' },
  { name: 'Submitted', value: 'Y' },
  { name: 'In Progress', value: 'I' },
  { name: 'Shipped', value: 'S' },
  { name: 'Cancelled', value: 'C' },
  { name: 'On Hold', value: 'O' },
];

const styleOptions = [
  { name: '數位+設計', value: 'Digital' },
  { name: '數位', value: '1' },
  { name: '僅設計', value: '3' },
  { name: '實體', value: '2' },
];

const Header: React.FC<Props> = ({ submitHandler, btnRef }) => {
  const form = useForm<HeaderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: HeaderFormDefaultValue,
  });

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
        <TableHeaderOption option="serial" control={form.control} label="Serial">
          {(field) => (
            <Input
              type="text"
              placeholder={'serial'}
              className="mr-2 w-24 rounded-md bg-white text-sm text-primary placeholder:text-primary/50"
              {...field}
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
          {(field) => <LabSelect selectValue={field.value} onSelectFn={field.onChange} showGroup={false} />}
        </TableHeaderOption>
        <TableHeaderOption option="orderstatus" control={form.control} label="狀態">
          {(field) => (
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-32 border-0 bg-white text-sm text-primary focus-visible:ring-0 focus-visible:ring-offset-0">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((el, i) => {
                  return (
                    <SelectItem key={i} value={el.value} className="text-primary">
                      {el.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </TableHeaderOption>
        <TableHeaderOption option="orderstyle" control={form.control} label="類型">
          {(field) => (
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-32 border-0 bg-white text-sm text-primary focus-visible:ring-0 focus-visible:ring-offset-0">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((el, i) => {
                  return (
                    <SelectItem key={i} value={el.value} className="text-primary">
                      {el.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </TableHeaderOption>
      </TableHeaderContainer>
    </Form>
  );
};
export default Header;
