import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCustomerList, Customers } from '@/features/customer/getCustomers';
import { FaCheck } from 'react-icons/fa6';
import { PiCaretUpDownBold } from 'react-icons/pi';
import { twMerge } from 'tailwind-merge';

type Props = {
  selectValue: string | undefined;
  onSelectFn: (value: string) => void;
  showGroup: boolean;
  triggerClass?: string;
  contentClass?: string;
};

const LabSelect: React.FC<Props> = ({ selectValue, onSelectFn, triggerClass, contentClass, showGroup }) => {
  const { data: customers, isPending, isError } = useCustomerList();
  if (isError) throw new Error('Something went wrong');
  if (isPending) return <LoadingSpinner className="h-4 w-4 border-2" />;
  const customerlist = showGroup
    ? [...customers]
    : [...customers.filter((c) => !new RegExp(/000$/).test(c.CUSTOMER_CODE))];
  const labs = [
    { CUSTOMER_SHORT_NAME: 'ALL', CUSTOMER_ID: 'ALL', COMPANY_ID: 210, CUSTOMER_SHORT_CODE: 'ALL' },
    ...customerlist,
  ];
  const transferName = (
    lab:
      | Customers
      | { CUSTOMER_SHORT_NAME: string; CUSTOMER_ID: string; COMPANY_ID: number; CUSTOMER_SHORT_CODE: string }
      | undefined,
  ) => {
    if (lab) {
      return lab.COMPANY_ID === 410 ? 'PLS-' + lab.CUSTOMER_SHORT_CODE : lab.CUSTOMER_SHORT_NAME;
    } else {
      return 'Not Found';
    }
  };
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          id="lab"
          variant={'secondary'}
          role="combobox"
          className={twMerge('w-40 justify-between bg-white text-sm text-primary', triggerClass)}
        >
          {selectValue ? transferName(labs.find((lab) => lab.CUSTOMER_ID.toString() === selectValue)) : 'Customers...'}
          <PiCaretUpDownBold />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={twMerge('popover-content-width-same-as-its-trigger p-0', contentClass)}>
        <Command>
          <CommandInput placeholder="Search" className="h-9" />
          <CommandEmpty>Not found</CommandEmpty>
          <CommandList>
            {labs.map((lab) => {
              return (
                <CommandItem
                  className="flex cursor-pointer justify-between"
                  key={lab.CUSTOMER_ID}
                  value={transferName(lab)}
                  onSelect={() => onSelectFn(lab.CUSTOMER_ID.toString())}
                >
                  {transferName(lab)}
                  {lab.CUSTOMER_ID === selectValue && <FaCheck />}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

LabSelect.displayName = 'LabSelect';
export default LabSelect;
