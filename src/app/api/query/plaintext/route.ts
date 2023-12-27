import { oracleErp } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const { input } = await req.json();
  const validation = (sql: string) => {
    // Remove comment
    sql = sql.replace(/\/\*[\s\S]*?\*\//g, ' ');
    sql = sql.replace(/--.*/g, ' ');

    sql = sql.toUpperCase();
    const disallowedPatterns =
      /\b(INSERT|UPDATE|DELETE|REPLACE|CREATE|ALTER|DROP|COMMIT|ROLLBACK|GRANT|REVOKE|USE|EXPLAIN)\b/i;

    if (disallowedPatterns.test(sql)) {
      return false;
    }

    return true;
  };
  if (!validation(input)) {
    return NextResponse.json({}, { status: 404, statusText: 'Disallowed SQL Operation Detected' });
  }

  try {
    const res = await oracleErp.query(input, { type: QueryTypes.RAW });
    return NextResponse.json({ result: res });
  } catch (error) {
    return NextResponse.json({}, { status: 404, statusText: 'Query is invalid' });
  }
};
