import { oracleErp } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import HabitSelect from './HabitSelect';

type Props = {
  customerId: string;
};

export type HabitsSelectDTO = {
  HABITS_ID: number;
  COMPANY_ID: number;
  HABITS_CATEGORY_ID: number;
  HABITS_CATEGORY_NAME: string;
  HABITS_CODE: string;
  HABITS_NAME: string;
  HABITS_DESC: string;
  PARENT_HABITS_ID: null;
  HABITS_STATUS: string;
  HABITS_LINE_ID: number;
  HABITS_ID_1: number;
  HABITS_LINE_NAME1: string;
  HABITS_LINE_NAME2: string;
  HABITS_LINE_VALUES: string;
  SORTING: 2;
  PARENT_HABITS_LINE_ID: null;
  HABITS_LINE_STATUS: string;
};

const HabitsSelect = async ({ customerId }: Props) => {
  const queryStr = `SELECT * FROM oms_habits_header a JOIN oms_habits_line b ON a.habits_id = b.habits_id`;
  const res = (await oracleErp.query(queryStr, { type: QueryTypes.SELECT })) as HabitsSelectDTO[];
  if (!res) throw new Error();
  const result = res.reduce((acc, cur) => {
    if (acc[cur.HABITS_NAME]) {
      acc[cur.HABITS_NAME].push(cur);
    } else {
      acc[cur.HABITS_NAME] = [cur];
    }
    return acc;
  }, {} as any);

  let customerHabits = [] as any[];
  if (customerId) {
    const queryStr2 = `SELECT * FROM oms_customer_habits where customer_id = ${customerId} and customer_habits_status = 'T'`;
    const res2 = await oracleErp.query(queryStr2, { type: QueryTypes.SELECT });
    if (!res2) throw new Error();
    customerHabits = res2;
  }

  return (
    <div className="grid grid-flow-col grid-rows-5 gap-2">
      {Object.keys(result).map((key) => {
        const defaultHabit = result[key].at(0);
        const customerHabit = customerHabits.find((habit) => habit.HABITS_ID === defaultHabit.HABITS_ID);
        return (
          <HabitSelect
            key={result[key].at(0).HABITS_ID}
            name={key}
            data={result[key]}
            defaultHabit={customerHabit ?? defaultHabit}
          />
        );
      })}
    </div>
  );
};

export default HabitsSelect;
