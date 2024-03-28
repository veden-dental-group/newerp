import { OPTIONS } from '@/app/api/auth/[...nextauth]/authOptions';
import { oracleCsp } from '@/lib/sequelize';
import axios from 'axios';
import dayjs from 'dayjs';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
const api = axios.create({
  baseURL: process.env.NEW_CSP_API,
  headers: { 'Content-Type': 'application/json' },
});

export const POST = async (request: Request) => {
  const session = await getServerSession(OPTIONS);
  if (!session || !session.user) {
    return NextResponse.json({}, { status: 400, statusText: 'Invaild User.' });
  }
  try {
    const body = await request.json();
    const data = { ...body };

    const res1 = await api.request({ url: '/order/updateDetail', method: 'PATCH', data });

    if (res1.status !== 200) {
      return NextResponse.json({}, { status: res1.status, statusText: res1.statusText });
    }
    const queryStr = `
    UPDATE
        csp_order_header_temp
    SET
        TRANS_FLAG='T',
        TRANS_DATE=TO_DATE('${dayjs().format('YYYY-MM-DD HH:mm:ss')}','YYYY-MM-DD hh24:mi:ss')
    WHERE
        CSP_SERIAL_NO=${body.CSP_SERIAL_NO} `;

    await oracleCsp.query(queryStr, { type: QueryTypes.UPDATE });

    return NextResponse.json({ result: res1.data });
  } catch (error: any) {
    let statusText = 'UpdateDetail Error! ';
    if (error.response) statusText = error.response.statusText;
    return NextResponse.json({}, { status: 400, statusText });
  }
};
