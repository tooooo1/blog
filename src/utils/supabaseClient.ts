"use client";

import { Database } from "@/__generated__/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function increment() {
  const { data, error } = await supabase
    .from("counter")
    .select("count")
    .eq("id", 1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const newCount = data.count + 1;

  const { error: updateError } = await supabase
    .from("counter")
    .update({ count: newCount })
    .eq("id", 1);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { count: newCount };
}
