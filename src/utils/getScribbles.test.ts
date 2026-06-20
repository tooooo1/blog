import { describe, it, expect } from "vitest";
import { getScribbles } from "./getScribbles";

describe("getScribbles", () => {
  it("returns a non-empty array (scribbles directory has at least one .mdx file)", () => {
    const scribbles = getScribbles();
    expect(Array.isArray(scribbles)).toBe(true);
    expect(scribbles.length).toBeGreaterThan(0);
  });

  it("each scribble has the required fields", () => {
    const scribbles = getScribbles();
    for (const scribble of scribbles) {
      expect(typeof scribble.date).toBe("string");
      expect(scribble.date.length).toBeGreaterThan(0);
      expect(typeof scribble.formattedDate).toBe("string");
      expect(scribble.formattedDate.length).toBeGreaterThan(0);
      expect(typeof scribble.title).toBe("string");
      expect(typeof scribble.content).toBe("string");
    }
  });

  it("formattedDate follows 'YYYY년 MM월 DD일' pattern derived from filename date", () => {
    const scribbles = getScribbles();
    for (const scribble of scribbles) {
      // The impl formats as `${year}년 ${month}월 ${day}일` from the YYYY-MM-DD filename
      expect(scribble.formattedDate).toMatch(/^\d{4}년 \d{2}월 \d{2}일$/);
    }
  });

  it("date field matches the filename without .mdx extension", () => {
    const scribbles = getScribbles();
    // Dates should be in YYYY-MM-DD format (the raw filename stem)
    for (const scribble of scribbles) {
      expect(scribble.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("returns scribbles sorted by date descending (newest first)", () => {
    const scribbles = getScribbles();
    for (let i = 0; i < scribbles.length - 1; i++) {
      expect(scribbles[i].date >= scribbles[i + 1].date).toBe(true);
    }
  });

  it("known scribble '2025-03-07' exists with correct fields", () => {
    const scribbles = getScribbles();
    const scribble = scribbles.find((s) => s.date === "2025-03-07");
    expect(scribble).toBeDefined();
    expect(scribble!.formattedDate).toBe("2025년 03월 07일");
    expect(typeof scribble!.content).toBe("string");
    expect(scribble!.content.length).toBeGreaterThan(0);
  });
});
