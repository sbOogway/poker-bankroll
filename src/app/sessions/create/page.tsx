import { SessionForm } from "@/components/session-form";
import { getTable } from "@/lib/supabase/crud";

type Params = {};

export default async function CreateSession(params: Params) {
  const account = await getTable("accounts");
  const games = await getTable("games");
  const categories = await getTable("categories");
  return (
    <SessionForm
      categories={categories}
      games={games}
      accounts={account}
    ></SessionForm>
  );
}
