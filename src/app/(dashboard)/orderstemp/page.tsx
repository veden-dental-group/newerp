'use client';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState, createRef } from 'react';
import { searchParamsBuilder } from '@/lib/searchParamsBuilder';

import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import Header, { HeaderForm } from './Header';

import { FaCopy } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import { ImDownload } from 'react-icons/im';
import { TbWorldDownload } from 'react-icons/tb';
import { GrSend } from 'react-icons/gr';
import { GrDocumentUpdate } from 'react-icons/gr';
import { IoMdCloseCircle } from 'react-icons/io';
import { ImListNumbered } from 'react-icons/im';

export default function Orderstemp() {
  const { toast } = useToast();
  const router = useRouter();
  const searchBtn = createRef<HTMLButtonElement>();

  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  const headers = [
    { key: 'CSP_SERIAL_NO', name: '流水號', type: 'copy' },
    { key: 'ACTIONS', name: 'ACTIONS' },
    { key: 'ORDER_STYLE_ID', name: '樣式' },
    { key: 'CUSTOMER_CODE', name: '客戶編號' },
    { key: 'CUSTOMER_SHORT_NAME', name: '客戶名稱' },
    { key: 'CREATE_DATE', name: '建立日期', type: 'date' },
    { key: 'ORDER_DATE', name: '訂單日期', type: 'date' },
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
      duration: 1500,
      variant: 'success',
      action: <FaCopy />,
    });
  };

  const handleUpdateDetail = async (entry: any) => {
    try {
      const res = await fetch('/api/csp/orderstemp/updateDetail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (res.status === 200) {
        const { result } = await res.json();
        toast({
          title: 'Updated!',
          description: result.erpSerialNumber,
          duration: 1500,
          variant: 'success',
          action: <FaCheckCircle />,
        });
      } else {
        toast({
          title: 'Failed!',
          description: res.statusText,
          duration: 1500,
          variant: 'destructive',
          action: <IoMdCloseCircle />,
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setHasError(null);
    }
  };

  const handelManualCreate = async (entry: any) => {
    try {
      const res = await fetch('/api/csp/orderstemp/manualCreate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (res.status === 200) {
        const { result } = await res.json();
        toast({
          title: 'Created!',
          description: result ? 1 : 0,
          duration: 1500,
          variant: 'success',
          action: <FaCheckCircle />,
        });
        searchBtn.current?.click();
      } else {
        toast({
          title: 'Failed!',
          description: res.statusText,
          duration: 1500,
          variant: 'destructive',
          action: <IoMdCloseCircle />,
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setHasError(null);
    }
  };

  const transStyle = (style_id: number) => {
    let label = '';
    if (style_id === 1) label = '數位';
    if (style_id === 2) label = '實體';
    if (style_id === 3) label = '僅設計';
    return label;
  };

  return (
    <div className="flex max-h-screen flex-col items-center gap-4 p-6">
      <div className="flex w-full">
        <Header submitHandler={handleSearch} btnRef={searchBtn} />
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
            <TableHeader className="sticky top-0 z-10 bg-primary text-xs">
              <TableRow>
                {headers.map((el) => (
                  <TableHead key={el.key} className="text-center font-bold text-white">
                    {el.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {entries.map((entry, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((el) => {
                    const val = entry[el.key];
                    return el.key === 'ACTIONS' ? (
                      <TableCell className="p-1 text-center" key={el.key}>
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
                                        duration: 1500,
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

                            {entry['CSP_ORDER_STATUS'] === 'C' ? null : (
                              <>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="pureIcon" size="smicon" onClick={() => handleUpdateDetail(entry)}>
                                      <GrSend />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>更新</TooltipContent>
                                </Tooltip>
                                {entry['TRANS_FLAG'] === 'F' ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="pureIcon"
                                        size="smicon"
                                        onClick={() => handelManualCreate(entry)}
                                      >
                                        <GrDocumentUpdate />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>生成</TooltipContent>
                                  </Tooltip>
                                ) : null}
                              </>
                            )}
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell key={el.key} className="p-1 text-center">
                        {el.type === 'date' ? (
                          <div className="whitespace-nowrap">
                            {dayjs(val).format('YYYY-MM-DD')}
                            <br />
                            {dayjs(val).format('HH:mm:ss')}
                          </div>
                        ) : el.type === 'copy' ? (
                          val && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                              <span>{val}</span>
                              <FaCopy
                                className="cursor-pointer text-primary hover:text-pin"
                                onClick={() => copyText(val)}
                              />
                            </div>
                          )
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            {el.key === 'ORDER_STYLE_ID' ? (
                              <>
                                <span>{transStyle(val)}</span>
                                <ImListNumbered className="cursor-pointer text-primary hover:text-pin" />
                              </>
                            ) : (
                              <span>{val}</span>
                            )}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
    </div>
  );
}
