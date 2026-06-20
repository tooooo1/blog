export const SITE_CONFIG = {
  name: "정충일",
  description: "프론트엔드 개발자의 기술 블로그",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tooo1.vercel.app",
  author: {
    name: "정충일",
    github: process.env.NEXT_PUBLIC_AUTHOR_GITHUB ?? "https://github.com/tooooo1",
    linkedin: process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN ?? "https://www.linkedin.com/in/tooo1",
  },
  keywords: ["프론트엔드", "개발", "블로그", "JavaScript", "React", "TypeScript", "Next.js"],
} as const;
