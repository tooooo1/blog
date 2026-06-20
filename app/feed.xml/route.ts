import { getAllPosts } from '@/utils/getPosts';
import { getScribbles } from '@/utils/getScribbles';
import { SITE_CONFIG } from '@/constants/site';

export const dynamic = 'force-static';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(dateString: string): string {
  return new Date(dateString).toUTCString();
}

export async function GET(): Promise<Response> {
  const posts = getAllPosts();
  const scribbles = getScribbles();

  type FeedItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    sortKey: string;
  };

  const postItems: FeedItem[] = posts
    .filter((post) => post.publishedAt)
    .map((post) => ({
      title: post.title,
      link: `${SITE_CONFIG.url}/blog/${post.slug}`,
      description: post.description || post.title,
      pubDate: toRfc822(post.publishedAt!),
      sortKey: post.publishedAt!,
    }));

  const scribbleItems: FeedItem[] = scribbles.map((scribble) => ({
    title: scribble.title,
    link: `${SITE_CONFIG.url}/scribble/${scribble.date}`,
    description: scribble.description || scribble.title,
    pubDate: toRfc822(scribble.date),
    sortKey: scribble.date,
  }));

  const allItems = [...postItems, ...scribbleItems].sort(
    (a, b) => new Date(b.sortKey).getTime() - new Date(a.sortKey).getTime()
  );

  const itemsXml = allItems
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.link}</guid>
    </item>`
    )
    .join('');

  const lastBuildDate = allItems.length > 0 ? allItems[0].pubDate : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${SITE_CONFIG.url}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
