import { oracleCsp } from '@/lib/sequelize';
import axios from 'axios';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
const api = axios.create({
  baseURL: process.env.NEW_CSP_API,
  headers: { 'Content-Type': 'application/json', 'newcsp-api-token': process.env.NEWCSP_API_TOKEN },
  timeout: 600000,
});

export const POST = async (request: Request) => {
  try {
    const { orderdate } = await request.json();
    const trans_date = (date: string | null) => {
      if (!date) return `''`;
      return `TO_DATE('${dayjs(date).format('YYYY-MM-DD HH:mm:ss')}','YYYY-MM-DD hh24:mi:ss')`;
    };
    if (orderdate) {
      let count = 0;
      const res = await api.request({ url: '/inquiries/erpsync', method: 'POST', data: { orderdate } });

      console.log('start inquiry sync', orderdate);

      if (res.status === 200 && res.data) {
        for (const inquiry of res.data) {
          const check = await oracleCsp.query(
            `SELECT * FROM CSP_INQUIRY_TEMP WHERE CSP_INQUIRY_ID = '${inquiry.inquiryId}' `,
            { type: QueryTypes.SELECT, logging: false },
          );
          if (check.length > 0) {
            const upd1 = `
              UPDATE CSP_INQUIRY_TEMP 
              SET TRANS_FLAG = 'F', 
              CSP_STATUS = '${inquiry.status}', 
              CSP_CLOSED_AT = ${trans_date(inquiry.closedAt)}, 
              CSP_CLOSED_BY = '${inquiry.closedBy ? inquiry.closedBy : ''}',
              CSP_LAST_RESPONSE_AT = ${trans_date(inquiry.lastResponseAt)}
              WHERE CSP_INQUIRY_ID = '${inquiry.inquiryId}' `;
            await oracleCsp.query(upd1, { type: QueryTypes.UPDATE, logging: false });
          } else {
            // insert inquiry
            const ins1 = `
              INSERT INTO CSP_INQUIRY_TEMP (
                TRANS_FLAG,
                CSP_INQUIRY_ID,
                CSP_CUSTOMER_ID,
                CSP_ORDER_ID,
                CSP_TYPE,
                CSP_TITLE,
                CSP_STATUS,
                CSP_CREATED_AT,
                CSP_CREATED_BY,
                CSP_CLOSED_AT,
                CSP_CLOSED_BY,
                CSP_LAST_RESPONSE_AT,
                CSP_ORDER_SERIAL
              ) VALUES (
                'F',
                '${inquiry.inquiryId}',
                '${inquiry.inquiryCustomer.erpCustomerId}',
                '${inquiry.orderId ? inquiry.orderId : ''}',
                '${inquiry.type}',
                '${inquiry.title ? inquiry.title.replace(/'/g, "''") : '[No Title]'}',
                '${inquiry.status}',
                ${trans_date(inquiry.createdAt)},
                '${inquiry.createdBy ? inquiry.createdBy : ''}',
                ${trans_date(inquiry.closedAt)},
                '${inquiry.closedBy ? inquiry.closedBy : ''}',
                ${trans_date(inquiry.lastResponseAt)},
                '${inquiry.order ? inquiry.order.erpSerialNumber || '' : ''}'
              )`;
            await oracleCsp.query(ins1, { type: QueryTypes.INSERT, logging: false });
          }

          // insert inquiry response
          for (const r of inquiry.responseInquiry) {
            const check2 = await oracleCsp.query(
              `SELECT * FROM CSP_INQUIRY_RESPONSE WHERE CSP_RESPONSE_ID = '${r.responseId}' `,
              { type: QueryTypes.SELECT, logging: false },
            );
            if (check2.length > 0) continue;
            const ins2 = `
              INSERT INTO CSP_INQUIRY_RESPONSE (
                CSP_INQUIRY_ID,
                CSP_RESPONSE_ID,
                MESSAGE,
                CSP_CREATED_AT,
                CSP_USER_NAME,
                CSP_USER_ID
              ) VALUES (
                '${r.inquiryId}',
                '${r.responseId}',
                '${r.message ? r.message.replace(/'/g, "''") : '[No Content]'}',
                ${trans_date(r.createdAt)},
                '${r.responseUser.name}',
                '${r.userId}'
              ) `;
            await oracleCsp.query(ins2, { type: QueryTypes.INSERT, logging: false });
          }
          count++;
        }
        return NextResponse.json({ count });
      } else {
        throw new Error('Invalid Request.');
      }
    } else {
      throw new Error('Invalid Request.');
    }
  } catch (error: any) {
    console.error(error);
    let statusText = 'inquriytemp sync Error! ';
    if (error) statusText += error;
    if (error.response) statusText = error.response.statusText;
    return NextResponse.json({}, { status: 400, statusText });
  }
};
