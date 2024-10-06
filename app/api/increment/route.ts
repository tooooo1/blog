import { NextResponse } from "next/server";

import type { Database } from "@/__generated__/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabase = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error(error);
          }
        },
      },
    }
  );
};

export async function POST() {
  const { data, error } = await supabase()
    .from("counter")
    .select("count")
    .eq("id", 1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const newCount = data.count + 1;

  const { error: updateError } = await supabase()
    .from("counter")
    .update({ count: newCount })
    .eq("id", 1);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return NextResponse.json({ count: newCount });
}
