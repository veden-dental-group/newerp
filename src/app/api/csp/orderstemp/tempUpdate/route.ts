import { oracleCsp } from '@/lib/sequelize';
import axios from 'axios';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
const api = axios.create({
  baseURL: process.env.NEW_CSP_API,
  headers: { 'Content-Type': 'application/json' },
});

export const POST = async (request: Request) => {
  try {
    const { from, to } = await request.json();
    if (from && to) {
      let queryStr = `
      SELECT a.*, b.product_name2, b.order_line_qty, c.customer_code, c.customer_short_name 
      FROM csp.csp_order_header_temp a 
      JOIN erp.oms_customer_header  c 
      ON a.csp_customer_id = c.customer_id 
      LEFT JOIN csp.csp_order_line_temp b 
      ON a.order_id = b.order_id AND b.order_line_no = 1 
      WHERE TRUNC(a.create_date) >= TO_DATE(${dayjs(from).format('YYYYMMDD')}, 'YYYYMMDD') 
      AND TRUNC(a.create_date) <= TO_DATE(${dayjs(to).format('YYYYMMDD')}, 'YYYYMMDD') `;

      queryStr += ' ORDER BY a.csp_serial_no ';
      const selectOrders = await oracleCsp.query(queryStr, { type: QueryTypes.SELECT });

      if (selectOrders && selectOrders.length) {
        // manualUpdateMany 更新newcsp單
        const updateOrders = selectOrders.filter((el: any) => el.CSP_UUID !== null);
        const res = await api.request({ url: '/order/tempUpdate', method: 'POST', data: { updateOrders } });
        return NextResponse.json({ res: res.data });
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
