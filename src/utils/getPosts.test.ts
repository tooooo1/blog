import { describe, it, expect } from "vitest";
import {
  formatDate,
  calculateReadingTime,
  getAllPosts,
  getPostBySlug,
  getCategories,
} from "./getPosts";

describe("formatDate", () => {
  it("formats a known date string into Korean locale output", () => {
    // The impl uses toLocaleDateString("ko-KR", { year:"numeric", month:"long", day:"numeric" })
    expect(formatDate("2025-12-27")).toBe("2025년 12월 27일");
  });

  it("formats another date correctly", () => {
    expect(formatDate("2024-01-05")).toBe("2024년 1월 5일");
  });

  it("returns a non-empty string for any valid date", () => {
    const result = formatDate("2020-06-15");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("calculateReadingTime", () => {
  it("returns a positive integer for non-empty content", () => {
    const result = calculateReadingTime("hello world");
    expect(result).toBeGreaterThan(0);
    expect(Number.isInteger(result)).toBe(true);
  });

  it("longer content yields a greater or equal reading time than shorter content", () => {
    const short = "word ".repeat(50);
    const long = "word ".repeat(500);
    expect(calculateReadingTime(long)).toBeGreaterThanOrEqual(
      calculateReadingTime(short)
    );
  });

  it("maps a known word count to the expected minutes (ceil(words/200))", () => {
    // 200 words exactly → 1 minute
    const exactly200 = "word ".repeat(200).trim();
    expect(calculateReadingTime(exactly200)).toBe(1);

    // 201 words → ceil(201/200) = 2
    const just201 = "word ".repeat(201).trim();
    expect(calculateReadingTime(just201)).toBe(2);

    // 400 words → 2 minutes
    const exactly400 = "word ".repeat(400).trim();
    expect(calculateReadingTime(exactly400)).toBe(2);
  });

  it("returns at least 1 for a single word", () => {
    expect(calculateReadingTime("one")).toBe(1);
  });
});

describe("getAllPosts", () => {
  it("returns a non-empty array (posts directory has at least one .mdx file)", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("returns posts sorted by publishedAt descending (newest first)", () => {
    const posts = getAllPosts();
    for (let i = 0; i < posts.length - 1; i++) {
      const current = posts[i].publishedAt;
      const next = posts[i + 1].publishedAt;
      if (current && next) {
        expect(new Date(current).getTime()).toBeGreaterThanOrEqual(
          new Date(next).getTime()
        );
      }
    }
  });

  it("each post has the required fields", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(typeof post.slug).toBe("string");
      expect(post.slug.length).toBeGreaterThan(0);
      expect(typeof post.title).toBe("string");
      expect(typeof post.category).toBe("string");
      expect(typeof post.description).toBe("string");
      expect(typeof post.content).toBe("string");
      expect(Array.isArray(post.tags)).toBe(true);
    }
  });
});

describe("getPostBySlug", () => {
  it("returns the correct post for a known existing slug", () => {
    const post = getPostBySlug("2025-in-review");
    expect(post).not.toBeNull();
    expect(post!.slug).toBe("2025-in-review");
    expect(typeof post!.title).toBe("string");
    expect(post!.title.length).toBeGreaterThan(0);
    expect(typeof post!.category).toBe("string");
    expect(typeof post!.content).toBe("string");
  });

  it("returns null for an unknown slug", () => {
    const post = getPostBySlug("this-slug-does-not-exist-xyz");
    expect(post).toBeNull();
  });
});

describe("getCategories", () => {
  it("returns an array", () => {
    const categories = getCategories();
    expect(Array.isArray(categories)).toBe(true);
  });

  it("returns no duplicate categories", () => {
    const categories = getCategories();
    const unique = new Set(categories);
    expect(unique.size).toBe(categories.length);
  });

  it("each category matches the category field of at least one post", () => {
    const categories = getCategories();
    const posts = getAllPosts();
    const postCategories = new Set(posts.map((p) => p.category));
    for (const cat of categories) {
      expect(postCategories.has(cat)).toBe(true);
    }
  });

  it("categories derived from posts covers every post's category", () => {
    const categories = new Set(getCategories());
    const posts = getAllPosts();
    for (const post of posts) {
      expect(categories.has(post.category)).toBe(true);
    }
  });
});
