'use client';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { searchParamsBuilder } from '@/lib/searchParamsBuilder';

import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import Header, { HeaderForm } from './Header';

import { FaCopy } from 'react-icons/fa6';
import { ImDownload } from 'react-icons/im';
import { TbWorldDownload } from 'react-icons/tb';
import { GrSend } from 'react-icons/gr';

export default function Orderstemp() {
  const { toast } = useToast();
  const router = useRouter();

  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  const headers = [
    { key: 'CSP_SERIAL_NO', name: '流水號', type: 'copy' },
    { key: 'CUSTOMER_CODE', name: '客戶編號' },
    { key: 'CUSTOMER_SHORT_NAME', name: '客戶名稱' },
    { key: 'CREATE_DATE', name: '建立日期', type: 'date' },
    { key: 'ORDER_RX', name: 'RX#' },
    { key: 'ORDER_CLINIC', name: '診所' },
    { key: 'ORDER_PATIENT', name: '病患' },
    { key: 'ORDER_DOCTOR', name: '醫生' },
    { key: 'OLD_ORDER_CODE', name: '廠內訂單號' },
    { key: 'ORDER_CODE', name: 'ERP訂單號' },
    { key: 'CSP_FILE_NAME', name: '檔名' },
  ];

  const handleSearch = async (value: HeaderForm) => {
    const { from, to } = value.date;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/csp/orderstemp/search?${searchParamsBuilder({ ...value, from, to })}`);
      setIsLoading(false);
      if (res.status === 200) {
        const { result } = await res.json();
        setEntries(result[0]);
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

  const copyText = async (value: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = value;
      // Move textarea out of the viewport so it's not visible
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.prepend(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }
    toast({
      title: 'Copied!',
      duration: 1000,
      variant: 'success',
      action: <FaCopy />,
    });
  };

  const handleUpdateDetail = async (entry: any) => {
    console.log(entry);
    try {
      setIsLoading(true);
      const res = await fetch('/api/csp/orderstemp/updateDetail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      setIsLoading(false);
      if (res.status === 200) {
        const result = await res.json();
        console.log(result);
      } else {
        setHasError(res.statusText);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setHasError(null);
    }
  };

  return (
    <div className="flex max-h-screen flex-col items-center gap-4 p-6">
      <div className="flex w-full">
        <Header submitHandler={handleSearch} />
      </div>
      {isLoading ? (
        <span className="text-2xl">
          <LoadingSpinner />
        </span>
      ) : hasError ? (
        <span className="text-2xl text-red-500">{hasError}</span>
      ) : (
        entries.length !== 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((el) => (
                  <TableHead key={el.key} className="text-center font-bold">
                    {el.name}
                  </TableHead>
                ))}
                <TableHead className="text-center font-bold">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((el) => {
                    const val = entry[el.key];
                    return (
                      <TableCell key={el.key} className="p-1 text-center">
                        {el.type === 'date'
                          ? dayjs(val).format('YYYY-MM-DD HH:mm:ss')
                          : el.type === 'copy'
                            ? val && (
                                <div className="flex items-center justify-center gap-1">
                                  <span>{val}</span>
                                  <FaCopy
                                    className="cursor-pointer text-primary hover:text-pin"
                                    onClick={() => copyText(val)}
                                  />
                                </div>
                              )
                            : val}
                      </TableCell>
                    );
                  })}
                  <TableCell className="p-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TooltipProvider delayDuration={500}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="pureIcon"
                              size="smicon"
                              onClick={() => {
                                const url: string = entry['CSP_FILE_URL'] || '';
                                if (url) {
                                  const startIndex = url.indexOf('/newcsp/') + '/newcsp/'.length;
                                  const downloadUrl = process.env.NEXT_PUBLIC_NAS_URL + url.slice(startIndex);
                                  window.open(downloadUrl.replace(/\+/gm, ' '));
                                } else {
                                  toast({
                                    title: '檔案未同步到NAS!',
                                    duration: 1000,
                                    variant: 'destructive',
                                  });
                                }
                              }}
                            >
                              <ImDownload />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>NAS</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="pureIcon"
                              size="smicon"
                              onClick={() => router.replace(entry['CSP_FILE_URL'] || '')}
                            >
                              <TbWorldDownload />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>s3</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="pureIcon" size="smicon" onClick={() => handleUpdateDetail(entry)}>
                              <GrSend />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>更新</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
    </div>
  );
}