import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import { createClient } from "./supabase/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

export const urlSubdomain =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/^https?:\/\/([^\.]+)/)?.[1];

export function getSessionFromCookie(
  cookie: Partial<{
    [key: string]: string;
  }>,
) {
  // console.debug(process.env.NEXT)
  const accessToken = cookie[`sb-${urlSubdomain}-auth-token`]?.slice(7);
  // console.debug(accessToken)
  if (!accessToken) {
    return null;
  }

  return JSON.parse(atob(accessToken));
}

export function randomString(length = 12) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * charset.length);
    result += charset.charAt(index);
  }
  return result;
}

// export async function getTable(tableName: string) {
//   const supabase = await createClient();

//   return supabase.from(tableName).select();
// }


