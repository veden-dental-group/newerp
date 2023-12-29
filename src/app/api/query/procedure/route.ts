import { oracleErp } from '@/lib/sequelize';
import oracledb from 'oracledb';
import { QueryTypes, DataTypes, Sequelize } from 'sequelize';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const { input } = await req.json();
  if (input === '') return NextResponse.json({ status: 400, result: 'Input Cannot Be Empty' });

  try {
    const queryStr = `
        DECLARE
            RX VARCHAR2(100);
            o_order_code VARCHAR2(100);
            o_msg VARCHAR2(20);
        BEGIN
          om001.ins_erp_order_header2(
            210,97,1,1,1,:RX,'','','','',1108,1,TO_DATE('20231108 14:37:00', 'yyyymmdd hh24:mi:ss'),
            null, 'admin', :o_order_code, :o_msg);
        END; `;

    const res = await oracleErp.query(queryStr, {
      bind: {
        RX: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: input },
        o_order_code: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_msg: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
      },
      type: QueryTypes.RAW,
    });
    if (res.length) {
      return NextResponse.json({ status: 200, result: res });
    } else {
      return NextResponse.json({ status: 204, result: 'Data Create Failed.' });
    }
  } catch (error) {
    console.log('error', error);
    return NextResponse.json({ status: 404, result: 'Query is invalid' });
  }
};
