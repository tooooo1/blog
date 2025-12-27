export interface Post {
  slug: string;
  category: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  publishedAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export const CATEGORIES: Record<string, Category> = {
  network: {
    id: "network",
    name: "Network",
    description: "네트워크",
  },
  retrospective: {
    id: "retrospective",
    name: "회고",
    description: "회고록",
  },
  // ... more categories
};
