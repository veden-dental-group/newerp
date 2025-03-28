import dayjs from 'dayjs';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { QueryTypes } from 'sequelize';

import { OPTIONS } from '@/app/api/auth/[...nextauth]/authOptions';
import { searchParamsParser } from '@/lib/searchParamsParser';
import { oracleCsp } from '@/lib/sequelize';

export const GET = async (request: Request) => {
  const session = await getServerSession(OPTIONS);
  if (!session?.user) return NextResponse.json({}, { status: 401, statusText: 'Not Authenticated' });
  try {
    const { company } = session.user;
    const url = new URL(request.url);
    const fields = ['from', 'to', 'rx', 'customer', 'filename', 'orderstyle', 'orderstatus', 'serial'];
    const { from, to, rx, customer, filename, orderstyle, orderstatus, serial } = searchParamsParser(url, fields);
    console.log(serial);

    let queryStr = `
    SELECT a.*, b.product_name2, b.order_line_qty, c.customer_code, c.customer_short_name, c.customer_short_code
    FROM csp.csp_order_header_temp a 
    JOIN erp.oms_customer_header  c 
    ON a.csp_customer_id = c.customer_id 
    LEFT JOIN csp.csp_order_line_temp b 
    ON a.order_id = b.order_id AND b.order_line_no = 1 
    WHERE 1=1 `;

    // queryStr += `AND a.company_id = ${company} `;

    if (from) {
      if (to) {
        queryStr += `AND TRUNC(a.create_date) >= TO_DATE(${dayjs(from).format('YYYYMMDD')}, 'YYYYMMDD') `;
        queryStr += `AND TRUNC(a.create_date) <= TO_DATE(${dayjs(to).format('YYYYMMDD')}, 'YYYYMMDD') `;
      } else {
        queryStr += `AND TRUNC(a.create_date) = TO_DATE(${dayjs(from).format('YYYYMMDD')}, 'YYYYMMDD') `;
      }
    }
    if (rx) queryStr += `AND a.order_rx LIKE '%${rx}%' `;
    if (customer) queryStr += `AND a.csp_customer_id = ${customer} `;
    if (filename) queryStr += `AND a.csp_file_name LIKE '%${filename}%' `;
    if (orderstyle && orderstyle !== 'All' && orderstyle !== 'Digital') {
      queryStr += `AND a.order_style_id = ${Number(orderstyle)} `;
    } else if (orderstyle === 'Digital') {
      queryStr += `AND a.order_style_id IN (1, 3) `;
    }
    if (orderstatus && orderstatus !== 'All') queryStr += `AND a.csp_order_status = '${orderstatus}' `;
    if (serial) queryStr += `AND a.csp_serial_no = ${Number(serial)} `;

    queryStr += ' ORDER BY a.csp_serial_no ';
    const res = await oracleCsp.query(queryStr);

    if (res) {
      const statusText = res.length ? '' : 'Data Not Found.';
      const colums = res[0].map((el: any) => {
        if (el['CUSTOMER_CODE'] == 'U132999') {
          el['CUSTOMER_NEW_NAME'] = 'PLS-' + el['CUSTOMER_SHORT_CODE'];
        } else {
          el['CUSTOMER_NEW_NAME'] = el['CUSTOMER_SHORT_NAME'];
        }
        return el;
      });
      return NextResponse.json({ result: [colums, res[1]] }, { status: 200, statusText });
    } else {
      return NextResponse.json({}, { status: 400, statusText: 'Query Failed.' });
    }
  } catch (error) {
    console.error('error', error);
    return NextResponse.json({}, { status: 404, statusText: 'Query is invalid' });
  }
};
