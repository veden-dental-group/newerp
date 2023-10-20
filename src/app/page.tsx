"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  const inputRef = useRef(null);

  const submitHandler = async () => {
    const input = inputRef.current!.value.trim();
    if (!input) return;
    setIsLoading(true);
    const res = await fetch("/api/query/plaintext", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
      }),
    });
    const { status, result } = await res.json();
    setIsLoading(false);
    if (status === 200) {
      setEntries(result[0]);
      setHeaders(result[1]);
      setHasError(null);
    } else {
      setHasError(result);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row items-center w-full gap-6">
        <Textarea disabled={isLoading} ref={inputRef} />
        <Button disabled={isLoading} onClick={submitHandler}>
          Submit
        </Button>
      </div>
      {isLoading ? (
        <span className="text-2xl">Loading ...</span>
      ) : hasError ? (
        <span className="text-red-500 text-2xl">{hasError}</span>
      ) : (
        entries.length !== 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header.name} className="">
                    {header.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header.name} className="">
                      {entry[header.name]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
    </main>
  );
}
