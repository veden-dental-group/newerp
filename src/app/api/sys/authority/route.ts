import { oracleErp } from '@/lib/sequelize';
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { QueryTypes } from 'sequelize';

export const GET = async () => {
  try {
    const queryStr = `SELECT * FROM sys_authority`;

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
