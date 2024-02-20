import React from 'react';
import { HabitsSelectDTO } from './HabitsSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type Props = {
  name: string;
  data: HabitsSelectDTO[];
  defaultHabit: HabitsSelectDTO;
};

const HabitSelect = ({ name, data, defaultHabit }: Props) => {
  return (
    <div className="flex min-w-0 items-center gap-2 border border-gray-300">
      <Label htmlFor={name} className="w-1/3 min-w-fit px-1">
        {data.at(0)?.HABITS_ID}.{name}
      </Label>
      <Select>
        <SelectTrigger className="w-screen flex-1 rounded-none border-primary" id={name}>
          <SelectValue placeholder={defaultHabit.HABITS_LINE_NAME1} />
        </SelectTrigger>
        <SelectContent>
          {data.map((el) => (
            <SelectItem key={el.HABITS_LINE_ID} value={el.HABITS_LINE_NAME1}>
              {el.HABITS_LINE_NAME1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HabitSelect;
