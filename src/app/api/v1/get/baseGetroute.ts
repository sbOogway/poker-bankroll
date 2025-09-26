import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function baseGetRoute(table: string, select: string) {
  const supa = await createClient();

  const sess = await supa.auth.getSession();

  if (!sess.data.session) {
    return NextResponse.json({ error: "u need auth" }, { status: 401 });
  }

  const { data } = await supa.from(table).select(select);

  return NextResponse.json(data, { status: 200 }); 
}
