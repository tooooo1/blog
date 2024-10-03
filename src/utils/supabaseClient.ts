"use client";

import { Database } from "@/__generated__/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function increment(): Promise<
  { count: number } | { error: string }
> {
  const { data, error } = await supabase
    .from("counter")
    .select("count")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching counter:", error.message);
    return { error: error.message };
  }

  const newCount = data.count + 1;

  const { error: updateError } = await supabase
    .from("counter")
    .update({ count: newCount })
    .eq("id", 1);

  if (updateError) {
    console.error("Error updating counter:", updateError.message);
    return { error: updateError.message };
  }

  return { count: newCount };
}
