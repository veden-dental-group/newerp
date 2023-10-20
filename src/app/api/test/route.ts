import sequelize from "@/lib/sequelize";
import { NextResponse } from "next/server";

export const GET = async () => {
  const res =
    await sequelize.query(`select distinct trunc(a.inout_date) inout_date,
  a.process_code,
  a.process_name,
  a.department,
  (select gem02
  from gem_file@TIPTOP
  where gemacti = 'Y'
    and gem01 = a.department) dept_name,
  a.inout_by,
                  (select employee_name
                  from erp.ba_employee
                  where employee_code = a.inout_by)    employee_name,
                  (select sum(qty_clasp)
                      from mes.cios_wip_process
                      where company_id = 110
                      and   process_code = a.process_code
                      and   inout_status = 'outbound'
                      and   process_bonus = 'Y'
                      and inout_by = a.inout_by
                      and   trunc(inout_date) = trunc(a.inout_date)) clasp_qty,
  sum(qty_toothcount) tooth_qty
  from mes.cios_wip_process a
  where a.company_id = 110
  --and   a.process_code = '3100'
  and   a.inout_status = 'outbound'
  and   a.process_bonus = 'Y'
  --and a.inout_by = '13120001'
  and   trunc(a.inout_date) >= TO_DATE('20231017', 'yyyymmdd')
  and   trunc(a.inout_date) < TO_DATE('20231019', 'yyyymmdd')
  group by trunc(a.inout_date),a.process_code,a.process_name,a.department,a.inout_by
  order by trunc(a.inout_date),a.department,a.process_code`);

  console.log(res);
  return NextResponse.json({ message: "success" });
};
