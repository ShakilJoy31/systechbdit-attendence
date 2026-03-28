// utils/metadata/generateMetadata.ts
import { Metadata } from "next";

export interface MetadataParams {
  title?: string;
  template?: string;
  defaultTitle?: string;
  description?: string;
  keywords?: string[];
  images?: string[];
  url?: string;
  type?: string;
  publishedTime?: string;
  authors?: string[];
}

export async function generateDynamicMetadata(params: MetadataParams = {}): Promise<Metadata> {
  const {
    title,
    defaultTitle = "Tech Element IT",
    description = "Your Vision Our Code & Technology. Building Software to Solve, Scale, and Succeed. From sparking ideas to driving growth, we guide you through every step of product development.",
    keywords = ["tech element it", "software development", "custom software", "web development", "app development", "product development", "software solutions", "digital transformation", "scalable software", "tech partners", "MVP development", "SaaS", "full-stack development"],
    images = ['https://plus.unsplash.com/premium_photo-1681399975135-252eab5fd2db?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    url = "https://tech-element-it-ltd.vercel.app",
    publishedTime,
    authors = ["Tech Element IT"],
  } = params;

  const metadataTitle = title ? `${title}` : defaultTitle;

  return {
    title: metadataTitle,
    description,
    keywords: keywords.join(', '),
    authors: authors.map(author => ({ name: author })),
    openGraph: {
      title: metadataTitle,
      description,
      url,
      siteName: defaultTitle,
      images: images.map(image => ({ url: image })),
      publishedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadataTitle,
      description,
      images,
      creator: 'Tech Element IT'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'googlea8d7a2f2715d8e6f.html', // Add when you get it
    },
    alternates: {
      canonical: url,
    },
  };
}