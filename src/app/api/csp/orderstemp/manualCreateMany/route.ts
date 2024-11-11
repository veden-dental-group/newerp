import axios from 'axios';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';

import { oracleCsp } from '@/lib/sequelize';

const api = axios.create({
  baseURL: process.env.NEW_CSP_API,
  headers: { 'Content-Type': 'application/json' },
  timeout: 600000,
});

export const POST = async (request: Request) => {
  try {
    const { orderdate } = await request.json();
    if (orderdate) {
      const checkLength = `SELECT COUNT(1) len FROM csp.csp_order_header_temp WHERE trans_flag='F' `;
      const getLength = await oracleCsp.query(checkLength, { type: QueryTypes.SELECT });
      const { LEN }: any = getLength[0];
      const runtimes = Math.ceil(LEN / 250);

      let countCreate = 0;
      let countUpdate = 0;
      let currentCursor: number | null = null;
      for (let i = 0; i < runtimes; i++) {
        const queryStr: string = `
        SELECT a.*, b.product_name2, b.order_line_qty, c.customer_code, c.customer_short_name 
        FROM csp.csp_order_header_temp a 
        JOIN erp.oms_customer_header  c 
        ON a.csp_customer_id = c.customer_id 
        LEFT JOIN csp.csp_order_line_temp b 
        ON a.order_id = b.order_id AND b.order_line_no = 1 
        WHERE a.trans_flag = 'F' ${
          currentCursor !== null ? `AND a.csp_serial_no > ${currentCursor} ` : ''
        }AND ROWNUM <= 250 ORDER BY a.csp_serial_no`;
        const selectOrders = await oracleCsp.query<{ csp_serial_no: number }>(queryStr, { type: QueryTypes.SELECT });
        currentCursor = selectOrders.length > 0 ? selectOrders[selectOrders.length - 1].csp_serial_no : null;

        if (selectOrders && selectOrders.length) {
          // manualCreateMany 建newcsp單  沒有CSP_UUID = newcsp尚未建單
          const manualOrders = selectOrders.filter((el: any) => !el.CSP_UUID);
          const res = await api.request({ url: '/order/manualCreateMany', method: 'POST', data: { manualOrders } });
          if (res.data) {
            const { cspOrders } = res.data;
            for (const cspOrder of cspOrders) {
              const { orderId, erpSerialNumber } = cspOrder;
              if (!erpSerialNumber || !orderId) continue;
              const queryStr = `
                UPDATE
                    csp_order_header_temp
                SET
                    CSP_UUID='${orderId}', TRANS_FLAG='T',
                    TRANS_DATE=TO_DATE('${dayjs().format('YYYY-MM-DD HH:mm:ss')}','YYYY-MM-DD hh24:mi:ss')
                WHERE
                    CSP_SERIAL_NO=${erpSerialNumber} `;

              const upd = await oracleCsp.query(queryStr, { type: QueryTypes.UPDATE });
              if (upd) countCreate++;
            }
          } else {
            throw new Error('NewCSP Response Crashed.');
          }

          // manualUpdateMany 更新newcsp單
          const updateOrders = selectOrders.filter((el: any) => el.CSP_UUID);
          const res2 = await api.request({ url: '/order/manualUpdateMany', method: 'POST', data: { updateOrders } });
          if (res2.data) {
            const { cspOrders } = res2.data;
            for (const cspOrder of cspOrders) {
              const { erpSerialNumber } = cspOrder;
              if (!erpSerialNumber) continue;
              const queryStr = `
              UPDATE
                  csp_order_header_temp
              SET
                  TRANS_FLAG='T',
                  TRANS_DATE=TO_DATE('${dayjs().format('YYYY-MM-DD HH:mm:ss')}','YYYY-MM-DD hh24:mi:ss')
              WHERE
                  CSP_SERIAL_NO=${erpSerialNumber} `;

              const upd = await oracleCsp.query(queryStr, { type: QueryTypes.UPDATE });
              if (upd) countUpdate++;
            }
          } else {
            throw new Error('NewCSP Response Crashed.');
          }
        }
      }

      return NextResponse.json({ countCreate, countUpdate });
    } else {
      throw new Error('Invalid Request.');
    }
  } catch (error: any) {
    console.error(error);
    let statusText = 'manualCreate Error! ';
    if (error) statusText += error;
    if (error.response) statusText = error.response.statusText;
    return NextResponse.json({}, { status: 400, statusText });
  }
};
