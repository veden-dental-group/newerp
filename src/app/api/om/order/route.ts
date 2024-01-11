import { oracleErp } from '@/lib/sequelize';
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';
import { QueryTypes } from 'sequelize';

export const POST = async (req: Request) => {
  const { company_id, csp_serial_no } = await req.json();
  if (!company_id) return NextResponse.json({}, { status: 400, statusText: 'company_id empty!' });
  if (!csp_serial_no) return NextResponse.json({}, { status: 400, statusText: 'csp_serial_no empty!' });

  try {
    const queryStr = `
					DECLARE
							i_company_id NUMBER;
							i_csp_serial_no NUMBER;
              o_order_id NUMBER;
              o_order_code VARCHAR2(20);
              o_order_rx VARCHAR2(50);
              o_order_clinic VARCHAR2(50);
              o_order_patient VARCHAR2(50);
							o_msg VARCHAR2(20);
					BEGIN
						ERP_UTILITY.get_order_header(
							:i_company_id, :i_csp_serial_no, :o_order_id, :o_order_code, :o_order_rx, :o_order_clinic, :o_order_patient, :o_msg);
					END; `;

    const res = await oracleErp.query(queryStr, {
      bind: {
        i_company_id: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: company_id },
        i_csp_serial_no: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: csp_serial_no },
        o_order_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        o_order_code: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_order_rx: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_order_clinic: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_order_patient: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_msg: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
      },
      type: QueryTypes.RAW,
    });

    if (res.length) {
      return NextResponse.json({ result: res });
    } else {
      return NextResponse.json({}, { status: 400, statusText: 'get_order_header Failed.' });
    }
  } catch (error) {
    console.error('error', error);
    return NextResponse.json({}, { status: 404, statusText: 'Query is invalid' });
  }
};
