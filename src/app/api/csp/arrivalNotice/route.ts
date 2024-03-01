import { OPTIONS } from '@/app/api/auth/[...nextauth]/authOptions';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { oracleCsp } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import dayjs from 'dayjs';
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
    const { orderdate } = await request.json();
    const date = dayjs(orderdate).format('YYYY-MM-DD');
    const res = await api.request({ url: '/order/sendArrivalNotice', method: 'POST', data: { date } });

    return NextResponse.json({ result: res.data });
  } catch (error: any) {
    let statusText = 'sendArrivalNotice Error! ';
    if (error.response) statusText = error.response.statusText;
    return NextResponse.json({}, { status: 400, statusText });
  }
};
