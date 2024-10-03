"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert">
      <p>문제가 발생했습니다:</p>
      <pre>{error.message}</pre>
      <button onClick={() => reset()}>다시 시도하기</button>
    </div>
  );
}
