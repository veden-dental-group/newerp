import React from 'react';
import { Button } from '../ui/button';
import { FaSearch } from 'react-icons/fa';
import SearchButton from './SearchButton';

interface Props extends React.PropsWithChildren {
  onClick: () => void;
  btnRef?: React.Ref<HTMLButtonElement>;
}

const TableHeaderContainer: React.FC<Props> = ({ children, onClick, btnRef }) => {
  return (
    <form className="flex w-full flex-wrap gap-2 p-2 text-base text-primary">
      {children}
      <SearchButton onClick={onClick} ref={btnRef} />
    </form>
  );
};
export default TableHeaderContainer;
