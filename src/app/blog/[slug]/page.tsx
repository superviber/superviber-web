import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DRAFTS_VISIBLE, getAllPosts, getPostBySlug, type PostImage } from "@/lib/blog";
import ReactMarkdown from "react-markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Used when a post does not declare its own `image` in frontmatter. */
const DEFAULT_POST_IMAGE: PostImage = {
  url: "/images/og-blog.jpg",
  width: 1200,
  height: 630,
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // getAllPosts already hides drafts, but dynamicParams means a direct URL
  // would still render one in production. Treat it as missing.
  if (!post || (post.draft && !DRAFTS_VISIBLE)) {
    return {
      title: "Post Not Found",
    };
  }

  const image = post.image ?? DEFAULT_POST_IMAGE;

  return {
    title: post.seo?.title || `${post.title} | Alignment Dialogues Blog`,
    description: post.seo?.description || post.summary,
    keywords: post.tags,
    authors: [{ name: post.author, url: post.authorUrl }],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `https://superviber.com/blog/${slug}`,
      siteName: "Superviber",
      images: [
        {
          ...image,
          alt: image.alt ?? post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [image.url],
    },
    alternates: {
      canonical: `https://superviber.com/blog/${slug}`,
    },
  };
}

// JSON-LD for blog post
function generateJsonLd(post: NonNullable<ReturnType<typeof getPostBySlug>>, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    author: {
      "@type": "Person",
      name: post.author,
      url: post.authorUrl,
    },
    datePublished: post.date,
    url: `https://superviber.com/blog/${slug}`,
    keywords: post.tags.join(", "),
    publisher: {
      "@type": "Organization",
      name: "SuperViber",
      url: "https://superviber.com",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || (post.draft && !DRAFTS_VISIBLE)) {
    notFound();
  }

  const jsonLd = generateJsonLd(post, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        {/* Header */}
        <section className="py-12 px-6 gradient-bg">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-6">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>-</span>
              <a
                href={post.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-300 transition-colors"
              >
                {post.author}
              </a>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-6 bg-black">
          <article className="max-w-3xl mx-auto prose prose-invert prose-lg prose-violet">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mt-12 mb-6">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white mt-10 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-zinc-300 leading-relaxed mb-4">{children}</p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-violet-300 text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-mono overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 overflow-x-auto mb-6">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 text-zinc-300 mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 text-zinc-300 mb-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-zinc-300">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-violet-500 pl-4 italic text-zinc-400 my-6">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="my-8 border-zinc-800" />,
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2 text-left font-semibold text-zinc-300 bg-zinc-800/50 border-b border-zinc-700">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 text-zinc-400 border-b border-zinc-800">{children}</td>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-zinc-950 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              See It In <span className="gradient-text">Action</span>
            </h2>
            <p className="text-zinc-400 mb-6">
              Explore the interactive demo to see alignment dialogues work in practice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/alignment/demo"
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all"
              >
                Explore the Demo
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors"
              >
                More Posts
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
