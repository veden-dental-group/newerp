import { oracleCsp } from '@/lib/sequelize';
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { QueryTypes } from 'sequelize';
import { getServerSession } from 'next-auth';
import { OPTIONS } from '@/app/api/auth/[...nextauth]/authOptions';
import { searchParamsParser } from '@/lib/searchParamsParser';
import dayjs from 'dayjs';

export const GET = async (request: Request) => {
  const session = await getServerSession(OPTIONS);
  if (!session?.user) return NextResponse.json({}, { status: 401, statusText: 'Not Authenticated' });
  try {
    const { company } = session.user;
    const url = new URL(request.url);
    const fields = ['from', 'to', 'rx', 'customer', 'filename', 'orderstyle'];
    const { from, to, rx, customer, filename, orderstyle } = searchParamsParser(url, fields);

    let queryStr = `
    SELECT a.*, b.product_name2, b.order_line_qty, c.customer_code, c.customer_short_name 
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
    if (rx) queryStr += `AND order_rx LIKE '%${rx}%' `;
    if (customer) queryStr += `AND csp_customer_id = ${customer} `;
    if (filename) queryStr += `AND csp_file_name LIKE '%${filename}%' `;
    if (orderstyle) queryStr += `AND order_style_id = ${Number(orderstyle)} `;

    queryStr += ' ORDER BY a.csp_serial_no ';
    const res = await oracleCsp.query(queryStr);

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
