import { NextResponse } from "next/server";
import XLSX from "xlsx";

export const POST = async (req: Request) => {
  const { headers, entries }: {headers: any[], entries:any[] } = await req.json();

  const ws_data = [
    [...headers.map((header) => header.name)],
    ...entries.map((entry) => headers.map((header) => entry[header.name])),
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);

  const maxWidths = headers.map((header, i) =>
    ws_data.reduce(
      (max, row) => Math.max(max, row[i] ? row[i].toString().length : 0),
      header.name.length
    )
  );

  ws["!cols"] = maxWidths.map((width) => ({ wch: width + 2 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

  const res = new NextResponse(buf);
  res.headers.set(
    "contect-type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.headers.set("Content-Disposition", "attachment; filename=report.xlsx");
  return res;
};
