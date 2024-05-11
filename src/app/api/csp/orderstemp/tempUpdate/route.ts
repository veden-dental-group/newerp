import { oracleCsp } from '@/lib/sequelize';
import axios from 'axios';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
const api = axios.create({
  baseURL: process.env.NEW_CSP_API,
  headers: { 'Content-Type': 'application/json' },
  timeout: 600000,
});

export const POST = async (request: Request) => {
  try {
    const { from, to, customer } = await request.json();
    if (from && to) {
      let queryStr = `
      SELECT a.*, b.product_name2, b.order_line_qty, c.customer_code, c.customer_short_name 
      FROM csp.csp_order_header_temp a 
      JOIN erp.oms_customer_header  c 
      ON a.csp_customer_id = c.customer_id 
      LEFT JOIN csp.csp_order_line_temp b 
      ON a.order_id = b.order_id AND b.order_line_no = 1 
      WHERE TRUNC(a.create_date) >= TO_DATE(${dayjs(from).format('YYYYMMDD')}, 'YYYYMMDD') 
      AND TRUNC(a.create_date) <= TO_DATE(${dayjs(to).format('YYYYMMDD')}, 'YYYYMMDD') 
      AND a.TRANS_FLAG = 'F' 
      AND a.TRANS_DATE IS NULL 
      AND ROWNUM <= 1000 
      `;

      if (customer) queryStr += `AND csp_customer_id = ${customer} `;
      queryStr += ' ORDER BY a.csp_serial_no ';
      const selectOrders = await oracleCsp.query(queryStr, { type: QueryTypes.SELECT });

      if (selectOrders && selectOrders.length) {
        // manualUpdateMany 更新newcsp單
        const updateOrders = selectOrders.filter((el: any) => el.CSP_SERIAL_NO !== null);
        const res = await api.request({ url: '/order/tempUpdate', method: 'POST', data: { updateOrders } });
        let countUpdate = 0;
        if (res.data) {
          const { cspOrders } = res.data;
          for (const cspOrder of cspOrders) {
            const { erpSerialNumber, orderId } = cspOrder;
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
            if (upd) countUpdate++;
          }
        }
        return NextResponse.json({ res: res.data, countUpdate });
      } else {
        return NextResponse.json('Orders not found');
      }
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
