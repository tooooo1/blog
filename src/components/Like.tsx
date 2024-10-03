"use client";

import { increment } from "@/utils/supabaseClient";
import { useState } from "react";

export const Like = () => {
  const [count, setCount] = useState<number>();

  const handleSupportClick = async () => {
    const result = await increment();
    setCount(result.count);
  };

  return (
    <>
      <button aria-label="응원하기" type="button" onClick={handleSupportClick}>
        &#10084;
      </button>
      <p>{count ? count.toLocaleString() : "하트를 누르면 응원 수가 나와요"}</p>
    </>
  );
};
