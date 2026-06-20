import { MetadataRoute } from 'next';
import { getAllPosts } from '@/utils/getPosts';
import { getScribbles } from '@/utils/getScribbles';
import { SITE_CONFIG } from '@/constants/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const scribbles = getScribbles();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const scribbleEntries: MetadataRoute.Sitemap = scribbles.map((scribble) => ({
    url: `${SITE_CONFIG.url}/scribble/${scribble.date}`,
    lastModified: scribble.date,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/scribble`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_CONFIG.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...postEntries,
    ...scribbleEntries,
  ];
}
