import { oracleCsp } from '@/lib/sequelize';
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { QueryTypes } from 'sequelize';

export const POST = async (req: Request) => {
  const { csp_order_id, company_id, customer_id, csp_file_url, csp_file_name, category } = await req.json();
  if (!csp_order_id) return NextResponse.json({}, { status: 400, statusText: 'csp_order_id empty!' });
  if (!company_id) return NextResponse.json({}, { status: 400, statusText: 'company_id empty!' });
  if (!customer_id) return NextResponse.json({}, { status: 400, statusText: 'customer_id empty!' });

  try {
    let style_id = 1;
    if (category) {
      if (category === 'digital') style_id = 1;
      if (category === 'conventional') style_id = 2;
      if (category === 'design') style_id = 3;
    }
    const queryStr = `
					DECLARE
							i_csp_uuid VARCHAR2(500);
							i_company_id NUMBER;
							i_customer_id NUMBER;
							i_csp_file_url VARCHAR2(500);
							i_csp_file_name VARCHAR2(200);
              i_order_style_id NUMBER;
							o_msg VARCHAR2(20);
					BEGIN
						CSP000.ins_csp_orders(
							:i_csp_uuid, :i_company_id, :i_customer_id, :i_csp_file_url, :i_csp_file_name, :i_order_style_id, :o_msg);
					END; `;

    const res = await oracleCsp.query(queryStr, {
      bind: {
        i_csp_uuid: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: csp_order_id },
        i_company_id: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: company_id },
        i_customer_id: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: customer_id },
        i_csp_file_url: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: csp_file_url },
        i_csp_file_name: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: csp_file_name },
        i_order_style_id: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: style_id },
        o_msg: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
      },
      type: QueryTypes.RAW,
    });

    if (res.length) {
      return NextResponse.json({ result: res });
    } else {
      return NextResponse.json({}, { status: 400, statusText: 'CSP_ORDERS_TEMP Insert Failed.' });
    }
  } catch (error) {
    console.error('error', error);
    return NextResponse.json({}, { status: 404, statusText: 'Query is invalid' });
  }
};
