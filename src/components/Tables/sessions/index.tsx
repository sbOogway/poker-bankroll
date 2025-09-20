import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compactFormat, standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getTopChannels } from "../fetch";

type TableArgs = {
  className: string;
  data: any[];
};

export async function SessionsTable(args: TableArgs) {
  // const data = await getTopChannels();

  console.debug(args.data);

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        args.className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Recent sessions
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Account</TableHead>
            <TableHead className="!text-left">Category</TableHead>
            <TableHead className="!text-left">Starting time</TableHead>
            <TableHead className="!text-left">Ending time</TableHead>
            <TableHead className="!text-left">Total time</TableHead>
            <TableHead className="!text-right">Buy-in</TableHead>
            <TableHead className="!text-right">Cash-out</TableHead>
            <TableHead className="!text-right">P/L</TableHead>
            <TableHead className="!text-right">Roi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {args.data.map((session, i) => {
            const start = new Date(session.start_time); // ← parsed Date
            const end = new Date(session.end_time); // ← parsed Date

            // difference in milliseconds
            const diffMs = end.getTime() - start.getTime();

            // convert to a readable format (e.g., HH:mm:ss)
            const diff = new Date(diffMs);
            const pad = (n: number) => String(n).padStart(2, "0");
            const duration = `${pad(diff.getUTCHours())}:${pad(diff.getUTCMinutes())}:${pad(diff.getUTCSeconds())}`;

            const pl = session.cash_out - session.buy_in;
            const roi = (pl / session.buy_in) * 100;
            return (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={session.name + i}
              >
                <TableCell className="flex min-w-fit items-center gap-3">
                  {/* <Image
                  src={channel.logo}
                  className="size-8 rounded-full object-cover"
                  width={40}
                  height={40}
                  alt={channel.name + " Logo"}
                  role="presentation"
                /> */}
                  <div className="">{session.account}</div>
                </TableCell>


                <TableCell className="!text-left">{session.category}</TableCell>
                <TableCell className="!text-left">{session.start_time}</TableCell>
                <TableCell className="!text-left">
                  {session.end_time}
                </TableCell>
                <TableCell className="!text-left">
                  {duration}
                </TableCell>
                <TableCell className="!text-right text-red">
                  {standardFormat(session.buy_in)}
                </TableCell>
                <TableCell className="!text-right text-green-light-1">
                  {standardFormat(session.cash_out)}
                </TableCell>
                <TableCell className="!text-right">{standardFormat(pl)}</TableCell>
                <TableCell className="!text-right">{standardFormat(roi)}%</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
