import { oracleErp } from '@/lib/sequelize';
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { QueryTypes } from 'sequelize';

export const GET = async () => {
  try {
    const queryStr = `SELECT * FROM sy_authority`;

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
