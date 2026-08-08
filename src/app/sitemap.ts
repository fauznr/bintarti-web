import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bintarti.store';
  
  // List of public static routes that we want Google to index
  const routes = [
    '',
    '/katalog',
    '/demo',
    // We intentionally do NOT index /sandbox-tema/[id] dynamically here 
    // because most of them are private client invitations.
    // However, we can index the public demo templates so they show up on Google:
    '/sandbox-tema/wedding-1',
    '/sandbox-tema/wedding-2',
    '/sandbox-tema/wedding-3',
    '/sandbox-tema/wedding-4',
    '/sandbox-tema/wedding-5',
    '/sandbox-tema/wedding-6',
    '/sandbox-tema/wedding-7',
    '/sandbox-tema/wedding-8',
    '/sandbox-tema/khitan-1',
    '/sandbox-tema/khitan-2',
    '/sandbox-tema/khitan-3',
    '/sandbox-tema/khitan-4',
    '/sandbox-tema/khitan-5',
    '/sandbox-tema/khitan-6',
    '/sandbox-tema/khitan-7',
    '/sandbox-tema/khitan-8',
    '/sandbox-tema/birthday-1',
    '/sandbox-tema/birthday-2',
    '/sandbox-tema/birthday-3',
    '/sandbox-tema/birthday-4',
    '/sandbox-tema/birthday-5',
    '/sandbox-tema/birthday-6',
    '/sandbox-tema/birthday-7',
    '/sandbox-tema/birthday-8',
    '/sandbox-tema/aqiqah-1',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/katalog' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/katalog' ? 0.9 : 0.6,
  }));
}
