import { createClient } from "./server";


export async function getTable(table: string) {
  const supa = await createClient();
  // const sess = await supa.auth.getSession();
  const { data } = await supa.from(table).select("*");
  return data;
}

export async function insertIntoTable(table :string, object: any) {
  const supa = await createClient();
  const {data, error}  = await supa.from(table).insert(object)
  return error
  
}

export async function deleteFromTable(table: string, id: number) {
  const supa = await createClient()
  const {data, error} = await supa.from(table).delete().eq("id", id)
  return error
}