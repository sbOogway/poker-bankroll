import { createClient } from "@/lib/supabase/server";
import { deleteFromTable } from "@/lib/supabase/crud";

export default async function DeleteSession({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  //   const { id } = router.query;

  // @ts-ignore 80007
  const sp = await searchParams;
  console.debug(sp);
  const supabase = await createClient();
  //   const session = await supabase.auth.getSession()
  //   console.debug(session)
  const { data, error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", Number(sp.id));

  console.debug(data);
  console.debug(error);
  //   console.log(id);
  //   await deleteFromTable("sessions", Number(id));
  //   router.push("/sessions");
}
