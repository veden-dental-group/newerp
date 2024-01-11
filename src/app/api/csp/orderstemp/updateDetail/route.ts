import { OPTIONS } from '@/app/api/auth/[...nextauth]/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
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
    const data = {
      orderId: body.CSP_UUID,
      o_order_code: body.ORDER_CODE,
      o_order_rx: body.ORDER_RX,
      o_serial_no: body.CSP_SERIAL_NO,
      o_order_clinic: body.ORDER_CLINIC,
      o_order_patient: body.ORDER_PATIENT,
      o_order_doctor: body.ORDER_DOCTOR,
    };

    const res1 = await api.request({ url: '/order/updateDetail', method: 'PATCH', data });
    const res2 = await api.request({
      url: '/order/updateStatus',
      method: 'POST',
      data: { orderId: body.CSP_UUID, status: 'In Progress' },
    });

    if (res1.status !== 200) {
      return NextResponse.json({}, { status: res1.status, statusText: res1.statusText });
    }
    if (res2.status !== 200) {
      return NextResponse.json({}, { status: res2.status, statusText: res2.statusText });
    }

    return NextResponse.json({ result: res2.data.result });
  } catch (error: any) {
    console.log(error);
    let statusText = 'insertcsp Error';
    return NextResponse.json({}, { status: 400, statusText });
  }
};
