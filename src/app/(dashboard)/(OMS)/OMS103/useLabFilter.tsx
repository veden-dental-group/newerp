'use client';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

const LabFilterContext = createContext<{ search: string; setSearch: React.Dispatch<React.SetStateAction<string>> }>(
  {} as any,
);

export const LabFilterContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [search, setSearch] = useState('');
  return <LabFilterContext.Provider value={{ search, setSearch }}>{children}</LabFilterContext.Provider>;
};

export const useLabFilter = () => {
  const { search, setSearch } = useContext(LabFilterContext);
  return { search, setSearch };
};
