import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { useQuery } from '@tanstack/react-query';
type Customers = {
  CUSTOMER_ID: number;
  COMPANY_ID: number;
  CUSTOMER_CODE: string;
  CUSTOMER_SHORT_NAME: string;
  COMPANY_NAME1?: string;
  COMPANY_NAME2?: string;
  COMPANY_OWNER_NAME1?: string;
  COMPANY_OWNER_NAME2: string;
  COMPANY_PHONE?: string;
  COMPANY_ADDRESS: string;
  COMPANY_TAX_ID: string;
  CONTINENT_ID?: number;
  CONTINENT_NAME: string;
  COUNTRY_ID?: number;
  COUNTRY_CODE?: string;
  COUNTRY_NAME: string;
  CURRENCY_ID?: number;
  CURRENCY_CODE?: string;
  CURRENCY_NAME?: string;
  PAYMENT_TERMS_ID?: number;
  CUSTOMER_PAYMENT_TERMS: string;
  PAYMENT_METHOD_ID?: number;
  CUSTOMER_PAYMENT_METHOD?: string;
  CUSTOMER_TOOTH_SYSTEM_ID?: number;
  CUSTOMER_TOOTH_SYSTEM_NAME: string;
  CUSTOMER_SHIPPING_ADDRESS?: string;
  CUSTOMER_SHIPPING_RECEIVER: string;
  CUSTOMER_INVOICE_ADDRESS?: string;
  CUSTOMER_INVOICE_RECIPIENT: string;
  PARENT_CUSTOMER_ID: number;
  CUSTOMER_STATUS: string;
  CREATE_DATE: Date;
  CREATE_BY?: string;
  MODIFY_DATE: Date;
  MODIFY_BY?: string;
};

export const getCustomerList = async ({ signal }: { signal: AbortSignal }): Promise<Customers[]> => {
  const res = await fetch('/api/om/customer', { signal });
  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  const { result } = await res.json();
  return result;
};

type QueryFnType = typeof getCustomerList;

type UseCustomerOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useCustomerList = ({ config }: UseCustomerOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['customer'],
    queryFn: ({ signal }) => getCustomerList({ signal }),
  });
};
