import { oracleErp } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import LabFilterInput from './LabFilterInput';
import LabList from './LabList';

type Props = {};

export type CustomerHeaderDTO = {
  CUSTOMER_ID: number;
  COMPANY_ID: number;
  CUSTOMER_STATUS: string;
  CREATE_DATE: Date;
  CREATE_BY: string;
  CUSTOMER_CODE: string;
  CUSTOMER_SHORT_CODE: string;
  CUSTOMER_SHORT_NAME: string;
};

const LabFilter = async (props: Props) => {
  const queryStr = `SELECT * FROM oms_customer_header WHERE company_id = 110 AND NOT Regexp_like(customer_code, '000$');`;

  const res = (await oracleErp.query(queryStr, { type: QueryTypes.SELECT })) as CustomerHeaderDTO[];
  if (!res) throw new Error();
  return (
    <div className="flex flex-col">
      <LabFilterInput />
      <LabList labs={res} />
    </div>
  );
};

export default LabFilter;
