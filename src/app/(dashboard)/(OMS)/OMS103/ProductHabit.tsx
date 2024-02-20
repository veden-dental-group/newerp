import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { oracleErp } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';

type Props = {
  customerId: string;
};

type CustomerHabitProdDTO = {
  CUSTOMER_HABITS_PROD_ID: number;
  COMPANY_ID: number;
  CUSTOMER_ID: number;
  CUSTOMER_CODE: string;
  CUSTOMER_SHORT_NAME: string;
  ORDER_TYPE: number;
  PRODUCT_ID: number;
  PRODUCT_CODE: string;
  PRODUCT_NAME: string;
  CUSTOMER_HABITS_PROD_DESC: string;
  SORTING: number;
  CUSTOMER_HABITS_PROD_STATUS: string;
  HABITS_CATEGORY_NAME: string;
};

const ProductHabit = async ({ customerId }: Props) => {
  if (!customerId) return <div>Please Select a Customer</div>;
  const queryStr = `SELECT a.*, b.habits_category_name FROM OMS_CUSTOMER_HABITS_PROD a LEFT JOIN (SELECT DISTINCT habits_category_id, habits_category_name FROM oms_habits_header) b ON a.order_type = b.habits_category_id WHERE customer_id = ${customerId} and customer_habits_prod_status = 'T'`;
  const res = (await oracleErp.query(queryStr, { type: QueryTypes.SELECT })) as CustomerHabitProdDTO[];
  if (!res) throw new Error();
  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-secondary">
        <TableRow>
          <TableHead>訂單類型</TableHead>
          <TableHead>產品碼</TableHead>
          <TableHead>產品名稱</TableHead>
          <TableHead>客戶習慣生產名稱</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {res.map((el) => (
          <TableRow key={el.CUSTOMER_HABITS_PROD_ID}>
            <TableCell className="p-0 py-1">
              {el.ORDER_TYPE}:{el.HABITS_CATEGORY_NAME}
            </TableCell>
            <TableCell className="p-0 py-1">{el.PRODUCT_CODE}</TableCell>
            <TableCell className="p-0 py-1">{el.PRODUCT_NAME}</TableCell>
            <TableCell className="p-0 py-1">{el.CUSTOMER_HABITS_PROD_DESC}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductHabit;
