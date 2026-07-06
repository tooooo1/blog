import { Scribble } from "@/utils/getScribbles";
import { EntryCard } from "./EntryCard";

interface ScribbleCardProps {
  scribble: Scribble;
}

export function ScribbleCard({ scribble }: ScribbleCardProps) {
  return (
    <EntryCard
      href={`/scribble/${scribble.date}`}
      title={scribble.title}
      description={scribble.description}
      meta={<time dateTime={scribble.date}>{scribble.formattedDate}</time>}
    />
  );
}
