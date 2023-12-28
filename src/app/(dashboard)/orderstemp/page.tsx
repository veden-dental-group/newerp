'use client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

export default function Orderstemp() {
  const [entries, setEntries] = useState([]);
  const [headers, setHeaders] = useState<{ name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  const submitHandler = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/oracle/csp/orderstemp');
      setIsLoading(false);
      if (res.status === 200) {
        const { result } = await res.json();
        setEntries(result[0]);
        setHeaders(result[1]);
        setHasError(null);
      } else {
        setHasError(res.statusText);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setHasError(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24 py-16">
      <div className="flex w-full flex-row items-center gap-6">
        <Button disabled={isLoading} onClick={submitHandler}>
          Submit
        </Button>
      </div>
      {isLoading ? (
        <span className="text-2xl">Loading ...</span>
      ) : hasError ? (
        <span className="text-2xl text-red-500">{hasError}</span>
      ) : (
        entries.length !== 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((el) => (
                  <TableHead key={el.name} className="">
                    {el.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((el) => (
                    <TableCell key={el.name} className="">
                      {entry[el.name]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
    </div>
  );
}
