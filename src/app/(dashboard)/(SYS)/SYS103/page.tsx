'use client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useRef, useState } from 'react';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [headers, setHeaders] = useState<{ name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submitHandler = async () => {
    const input = inputRef.current!.value.trim();
    if (!input) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/query/plaintext', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
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
      console.error(error);
      setIsLoading(false);
      setHasError(null);
    }
  };

  const exportHandler = async () => {
    if (entries.length === 0 || hasError) return;

    const res = await fetch('/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headers,
        entries,
      }),
    });

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex max-h-screen max-w-[calc(100vw-12rem)] flex-col items-center justify-between p-4">
      <div className="flex w-full flex-row items-center gap-6">
        <Textarea disabled={isLoading} ref={inputRef} />
        <Button disabled={isLoading} onClick={submitHandler}>
          Submit
        </Button>
        <Button disabled={isLoading || entries.length === 0 || !!hasError} onClick={exportHandler}>
          Export
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
                  <TableHead key={el.name} className="p-2">
                    {el.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((el) => (
                    <TableCell key={el.name} className="p-2">
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
