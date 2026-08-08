import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/api/', 
        '/cek-undangan/', 
        '/formulir/'
      ],
    },
    sitemap: 'https://bintarti.store/sitemap.xml',
  };
}
