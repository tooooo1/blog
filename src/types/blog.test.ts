import { describe, it, expect } from "vitest";
import { CATEGORY_LABELS, getCategoryLabel } from "./blog";

describe("CATEGORY_LABELS", () => {
  it("is a non-empty object", () => {
    expect(typeof CATEGORY_LABELS).toBe("object");
    expect(Object.keys(CATEGORY_LABELS).length).toBeGreaterThan(0);
  });

  it("each entry has a name and description string", () => {
    for (const [, label] of Object.entries(CATEGORY_LABELS)) {
      expect(typeof label.name).toBe("string");
      expect(label.name.length).toBeGreaterThan(0);
      expect(typeof label.description).toBe("string");
    }
  });

  it("contains authored slugs 'network' and 'retrospective'", () => {
    expect(CATEGORY_LABELS).toHaveProperty("network");
    expect(CATEGORY_LABELS).toHaveProperty("retrospective");
  });
});

describe("getCategoryLabel", () => {
  it("returns the correct label for a known slug 'retrospective'", () => {
    const label = getCategoryLabel("retrospective");
    expect(label.name).toBe("회고");
    expect(label.description).toBe("회고록");
  });

  it("returns the correct label for a known slug 'network'", () => {
    const label = getCategoryLabel("network");
    expect(label.name).toBe("Network");
    expect(label.description).toBe("네트워크");
  });

  it("falls back gracefully for an unknown slug: name equals the slug", () => {
    const slug = "unknown-category-xyz";
    const label = getCategoryLabel(slug);
    expect(label.name).toBe(slug);
    expect(label.description).toBe("");
  });

  it("fallback for unknown slug returns a CategoryLabel shape", () => {
    const label = getCategoryLabel("anything");
    expect(typeof label.name).toBe("string");
    expect(typeof label.description).toBe("string");
  });
});
