import { OPTIONS } from '@/app/api/auth/[...nextauth]/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { oracleCsp } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import dayjs from 'dayjs';
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
    const erpOrder = { ...body };

    const res = await api.request({ url: '/order/manualCreate', method: 'POST', data: { erpOrder } });

    if (res.status !== 200) {
      return NextResponse.json({}, { status: res.status, statusText: res.statusText });
    }

    const { erpSerialNumber, orderId } = res.data;
    if (erpSerialNumber && orderId) {
      const queryStr = `
      UPDATE
          csp_order_header_temp
      SET
          CSP_UUID='${orderId}', TRANS_FLAG='T', 
          TRANS_DATE=TO_DATE('${dayjs().format('YYYY-MM-DD HH:mm:ss')}','YYYY-MM-DD hh24:mi:ss')
      WHERE
          CSP_SERIAL_NO=${erpSerialNumber} `;

      const upd = await oracleCsp.query(queryStr, { type: QueryTypes.UPDATE });

      return NextResponse.json({ result: upd });
    } else {
      return NextResponse.json({}, { status: 400, statusText: 'NewCSP Response Crashed.' });
    }
  } catch (error: any) {
    let statusText = 'manualCreate Error! ';
    if (error.response) statusText = error.response.statusText;
    return NextResponse.json({}, { status: 400, statusText });
  }
};
