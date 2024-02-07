import React from 'react';
import { FormField, FormItem, FormLabel } from '../ui/form';
import { Control } from 'react-hook-form';

type Props = {
  option: string;
  control: Control<any>;
  children: (field: any) => React.ReactNode;
  label?: string;
};

const TableHeaderOption: React.FC<Props> = ({ children, option, control, label }) => {
  return (
    <FormField
      control={control}
      name={option}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel className="whitespace-nowrap text-sm">
              {label ? label : option.toLowerCase().replace(/^\w|\s\w/g, (char) => char.toUpperCase())}:
            </FormLabel>
            {children(field)}
          </div>
        </FormItem>
      )}
    />
  );
};
export default TableHeaderOption;
