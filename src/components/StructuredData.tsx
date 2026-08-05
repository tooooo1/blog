import { SITE_CONFIG } from "@/constants/site";

interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  slug: string;
  tags: string[];
}

const PERSON_ID = `${SITE_CONFIG.url}/#person`;
const WEBSITE_ID = `${SITE_CONFIG.url}/#website`;

const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_CONFIG.author.name,
  alternateName: "Chung-il Jung",
  url: SITE_CONFIG.url,
  jobTitle: "프론트엔드 개발자",
  worksFor: { "@type": "Organization", name: "웰로" },
  knowsAbout: [...SITE_CONFIG.keywords],
  sameAs: [SITE_CONFIG.author.github, SITE_CONFIG.author.linkedin],
};

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteStructuredData() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": WEBSITE_ID,
            name: SITE_CONFIG.name,
            description: SITE_CONFIG.description,
            url: SITE_CONFIG.url,
            inLanguage: "ko-KR",
            author: { "@id": PERSON_ID },
            publisher: { "@id": PERSON_ID },
          },
          personNode,
        ],
      }}
    />
  );
}

export function ProfileStructuredData() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ProfilePage",
            "@id": `${SITE_CONFIG.url}/about`,
            url: `${SITE_CONFIG.url}/about`,
            inLanguage: "ko-KR",
            mainEntity: { "@id": PERSON_ID },
            isPartOf: { "@id": WEBSITE_ID },
          },
          personNode,
        ],
      }}
    />
  );
}

export function BlogPostStructuredData({
  title,
  description,
  publishedAt,
  updatedAt,
  slug,
  tags,
}: BlogPostStructuredDataProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BlogPosting",
            headline: title,
            description,
            url: `${SITE_CONFIG.url}/blog/${slug}`,
            datePublished: publishedAt,
            dateModified: updatedAt || publishedAt,
            inLanguage: "ko-KR",
            author: { "@id": PERSON_ID },
            publisher: { "@id": PERSON_ID },
            keywords: tags.join(", "),
            isPartOf: { "@id": WEBSITE_ID },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_CONFIG.url}/blog/${slug}`,
            },
          },
          personNode,
        ],
      }}
    />
  );
}
