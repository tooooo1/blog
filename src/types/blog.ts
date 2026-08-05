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

export interface CategoryLabel {
  name: string;
  description: string;
}

export const CATEGORY_LABELS: Record<string, CategoryLabel> = {
  network: {
    name: "Network",
    description: "네트워크",
  },
  retrospective: {
    name: "회고",
    description: "회고록",
  },
  infra: {
    name: "인프라",
    description: "빌드·배포·컨테이너",
  },
};

export function getCategoryLabel(slug: string): CategoryLabel {
  return CATEGORY_LABELS[slug] ?? { name: slug, description: "" };
}
