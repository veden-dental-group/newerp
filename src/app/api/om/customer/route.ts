import { oracleErp } from '@/lib/sequelize';
import oracledb from 'oracledb';
import { QueryTypes, DataTypes, Sequelize } from 'sequelize';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const GET = async () => {
  try {
    const queryStr = `
		SELECT
        *
    FROM
        om_customer_header
    WHERE
        ( company_id = 410 )
        OR ( company_id = 210
            AND customer_short_name NOT LIKE 'CNC%'
            AND customer_code != 'U132999' ) `;

    const res = await oracleErp.query(queryStr, { type: QueryTypes.SELECT });

    if (res.length) {
      return NextResponse.json({ result: res });
    } else {
      return NextResponse.json({}, { status: 204, statusText: 'Data Not Found.' });
    }
  } catch (error) {
    console.error('error', error);
    return NextResponse.json({}, { status: 404, statusText: 'Query is invalid' });
  }
};
