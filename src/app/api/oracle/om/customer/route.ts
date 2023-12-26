import sequelize from '@/lib/sequelize';
import oracledb from 'oracledb';
import { QueryTypes, DataTypes, Sequelize } from 'sequelize';
import { NextResponse } from 'next/server';

export const GET = async () => {
	try {
		const queryStr = `
		SELECT
				customer_id,
				company_id,
				customer_short_name,
				company_name1,
				customer_code
		FROM
				om_customer_header
		WHERE
				company_id = 210`;

		const res = await sequelize.query(queryStr, { type: QueryTypes.SELECT });
		
		if (res.length) {
			return NextResponse.json({ status: 200, result: res });
		} else {
			return NextResponse.json({ status: 204, result: 'Data not found.' });
		}
	} catch (error) {
		console.log('error', error);
		return NextResponse.json({ status: 404, result: 'Query is invalid' });
	}
};
