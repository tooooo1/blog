import { ViewTransition } from "react";

const DIRECTIONAL = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "page-cross",
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition update={DIRECTIONAL} enter={DIRECTIONAL} exit={DIRECTIONAL}>
      <div className="w-full flex flex-col items-center">{children}</div>
    </ViewTransition>
  );
}
