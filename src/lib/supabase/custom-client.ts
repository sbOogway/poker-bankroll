import { createClient } from "@supabase/supabase-js";

export async function createCustomClient(jwt: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      accessToken: async () => {
        return jwt;
      },
    }
  );
}
