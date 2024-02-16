import { oracleCsp } from '@/lib/sequelize';
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { QueryTypes } from 'sequelize';

export const GET = async (req: Request) => {
  try {
    const queryStr = `
					DECLARE
              i_csp_serial_no NUMBER;
					BEGIN
						CSP001.send_manual_create(:i_csp_serial_no);
					END; `;

    const res = await oracleCsp.query(queryStr, {
      bind: {
        i_csp_serial_no: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: 1248 },
      },
      type: QueryTypes.RAW,
    });

    if (res.length) {
      return NextResponse.json({ result: res });
    } else {
      return NextResponse.json({}, { status: 400, statusText: 'CSP_ORDERS_TEMP Insert Failed.' });
    }
  } catch (error) {
    console.error('error', error);
    return NextResponse.json({}, { status: 404, statusText: 'Query is invalid' });
  }
};
