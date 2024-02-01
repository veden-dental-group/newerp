import React from 'react';
import { Button } from '../ui/button';
import { FaSearch } from 'react-icons/fa';

interface SearchButtonProps {
  onClick: () => void;
}

const SearchButton = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<SearchButtonProps>>((props, ref) => (
  <Button variant={'pureIcon'} size={'icon'} type="submit" onClick={props.onClick} ref={ref}>
    <FaSearch className="h-10 w-10 shrink-0 cursor-pointer rounded-md bg-pin p-2 text-white hover:bg-pin/50" />
  </Button>
));

SearchButton.displayName = 'SearchButton';
export default SearchButton;
