import axios from 'axios';
import { NextResponse } from 'next/server';
const api = axios.create({
  timeout: 600000,
  baseURL: 'http://172.16.43.64:3000/luxlink',
  headers: { 'Content-Type': 'application/json' },
});

export const dynamic = 'force-dynamic';
export const GET = async (request: Request) => {
  try {
    const res = await api.request({ url: '/task', method: 'GET' });

    return NextResponse.json(res.data);
  } catch (error: any) {
    let statusText = 'LUXLINK Error! ';
    return NextResponse.json({}, { status: 400, statusText });
  }
};
