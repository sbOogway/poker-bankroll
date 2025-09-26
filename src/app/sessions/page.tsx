import { getTable } from "@/lib/supabase/crud";
import { JSX } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui-elements/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionsTable } from "@/components/Tables/sessions";

type Session = any;

export default async function SessionPage() {
  const data = await getTable("sessions");

  if (!data) {
    return "u dont have any session";
  }
  const dataComponents: JSX.Element[] = [];
  console.debug(data);

  data.map((session) => {
    dataComponents.push(
      <TableRow key={session.id}>
        <TableCell>{session.buy_in}</TableCell>

        <TableCell>{session.cash_out}</TableCell>
      </TableRow>,
    );
  });

  return (
    <SessionsTable data={data} className=""></SessionsTable>
  );
}
