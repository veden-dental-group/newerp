import { oracleCsp } from '@/lib/sequelize';
import { NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import dayjs from 'dayjs';

export const PATCH = async (req: Request) => {
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({}, { status: 400, statusText: 'csp_order_id empty!' });

  try {
    const queryStr = `
    UPDATE
        csp_order_header_temp
    SET
        CSP_ORDER_STATUS='C', 
        TRANS_FLAG='T', 
        TRANS_DATE=TO_DATE('${dayjs().format('YYYY-MM-DD HH:mm:ss')}','YYYY-MM-DD hh24:mi:ss')
    WHERE
        CSP_UUID='${orderId}' AND TRANS_FLAG='F' AND ORDER_ID IS NULL `;

    const upd = await oracleCsp.query(queryStr, { type: QueryTypes.UPDATE });

    return NextResponse.json({ affectRows: upd[1] });
  } catch (error) {
    console.error('error', error);
    return NextResponse.json({}, { status: 404, statusText: 'Query is invalid' });
  }
};
