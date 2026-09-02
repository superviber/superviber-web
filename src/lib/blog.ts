import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

/**
 * Posts marked `draft: true` in frontmatter are visible while developing and
 * excluded from the built site, so an unfinished file sitting in content/blog
 * never ships. Mirrors how the admin API gates itself on NODE_ENV.
 */
export const DRAFTS_VISIBLE = process.env.NODE_ENV === 'development';

/** Social card for a post. Dimensions are declared so scrapers can lay the
 *  preview out without fetching the file first. */
export interface PostImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  authorUrl?: string;
  summary: string;
  tags: string[];
  content: string;
  /** Only set when the post declares its own card; callers apply the default. */
  image?: PostImage;
  draft: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  tags: string[];
  draft: boolean;
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts = files.map(filename => {
    const slug = filename.replace(/\.(mdx|md)$/, '');
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      author: data.author || 'Eric Garcia',
      summary: data.summary || '',
      tags: data.tags || [],
      draft: data.draft === true,
    };
  });

  // Sort by date descending
  return posts
    .filter(post => DRAFTS_VISIBLE || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Normalises the optional `image` frontmatter key. Both forms are accepted:
 *
 *   image: /images/posts/my-post.jpg          # assumed 1200x630
 *
 *   image:                                    # for art of any other size
 *     url: /images/posts/my-post.jpg
 *     width: 1600
 *     height: 840
 *     alt: A description of the image
 *
 * Returns undefined when the key is absent or malformed, so the caller falls
 * back to the site's blog card rather than emitting a broken og:image.
 */
function parsePostImage(value: unknown): PostImage | undefined {
  if (typeof value === 'string') {
    const url = value.trim();
    return url ? { url, width: 1200, height: 630 } : undefined;
  }

  if (value && typeof value === 'object') {
    const { url, width, height, alt } = value as Record<string, unknown>;
    if (typeof url !== 'string' || !url.trim()) return undefined;

    return {
      url: url.trim(),
      width: typeof width === 'number' ? width : 1200,
      height: typeof height === 'number' ? height : 630,
      ...(typeof alt === 'string' && alt.trim() ? { alt: alt.trim() } : {}),
    };
  }

  return undefined;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);

  let filePath = '';
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    author: data.author || 'Eric Garcia',
    authorUrl: data.authorUrl || 'https://muffinlabs.ai/about',
    summary: data.summary || '',
    tags: data.tags || [],
    content,
    image: parsePostImage(data.image),
    draft: data.draft === true,
    seo: data.seo,
  };
}
