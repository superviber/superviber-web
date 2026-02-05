import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  authorUrl?: string;
  summary: string;
  tags: string[];
  content: string;
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
    };
  });

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
    seo: data.seo,
  };
}
