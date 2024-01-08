import React from 'react';
import { Button } from '../ui/button';
import { FaSearch } from 'react-icons/fa';

interface Props extends React.PropsWithChildren {
  onClick: () => void;
}

const TableHeaderContainer: React.FC<Props> = ({ children, onClick }) => {
  return (
    <form className="flex w-full flex-wrap gap-2 p-2 text-base text-primary">
      {children}
      <Button variant={'pureIcon'} size={'icon'} type="submit" onClick={onClick}>
        <FaSearch className="h-10 w-10 shrink-0 cursor-pointer rounded-md bg-pin p-2 text-white hover:bg-pin/50" />
      </Button>
    </form>
  );
};
export default TableHeaderContainer;
