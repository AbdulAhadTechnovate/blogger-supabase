import { Metadata } from 'next';

import { headers } from 'next/headers';

import appConfig from '~/config/app.config';

/**
 * @name generateRootMetadata
 * @description Generates the root metadata for the application
 */
export const generateRootMetadata = async (): Promise<Metadata> => {
  const headersStore = await headers();
  const csrfToken = headersStore.get('x-csrf-token') ?? '';

  return {
    title: appConfig.title || 'Bloggerr',
    description: appConfig.description,
    metadataBase: new URL(appConfig.url),
    applicationName: appConfig.name || 'Bloggerr',
    other: {
      'csrf-token': csrfToken,
    },
    openGraph: {
      url: appConfig.url,
      siteName: appConfig.name || 'Bloggerr',
      title: appConfig.title || 'Bloggerr',
      description: appConfig.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: appConfig.title || 'Bloggerr',
      description: appConfig.description,
    },
    icons: {
      icon: [
        { url: '/images/favicon/favicon.png', type: 'image/png', sizes: 'any' },
        { url: '/images/favicon/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { url: '/images/favicon/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      ],
      apple: [
        { url: '/images/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: '/images/favicon/favicon.png',
    },
  };
};
