import { oracleErp } from '@/lib/sequelize';
import { NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
export const dynamic = 'force-dynamic';
export const GET = async () => {
  try {
    const queryStr = `
    SELECT
        *
    FROM
        oms_customer_header
    WHERE
        ( company_id = 410
          AND customer_code = 'U132999' )
        OR ( company_id = 210
            AND customer_short_name NOT LIKE 'CNC%'
            AND customer_code != 'U132999' )`;

    const res = await oracleErp.query(queryStr, { type: QueryTypes.SELECT });

    if (res) {
      const statusText = res.length ? '' : 'Data Not Found.';
      return NextResponse.json({ result: res }, { status: 200, statusText });
    } else {
      return NextResponse.json({}, { status: 400, statusText: 'Query Failed.' });
    }
  } catch (error) {
    console.error('error', error);
    return NextResponse.json({}, { status: 404, statusText: 'Query is invalid' });
  }
};
