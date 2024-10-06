"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const Like = () => {
  const [count, setCount] = useState<number>();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/increment", {
        method: "POST",
      });
      const data: { count: number } = await response.json();

      return data;
    },
    onSuccess: (data) => {
      setCount(data.count);
    },
  });

  const text = (() => {
    if (isPending && count === undefined) {
      return "응원 중...";
    }

    if (count) {
      return count.toLocaleString();
    }

    return "하트를 누르면 응원 수가 나와요";
  })();

  return (
    <>
      <button
        aria-label="응원하기"
        type="button"
        onClick={() => mutate()}
        disabled={isPending}
      >
        &#10084;
      </button>
      <p>{text}</p>
    </>
  );
};
