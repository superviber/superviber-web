import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Alignment Dialogues Development",
  description: "Technical blog documenting the development of alignment dialogues, multi-agent deliberation systems, and coordinated AI decision-making.",
  keywords: ["alignment dialogues", "multi-agent AI", "deliberation systems", "AI development", "technical blog"],
  openGraph: {
    title: "Alignment Dialogues Blog",
    description: "Technical blog on multi-agent deliberation systems development",
    type: "website",
    url: "https://superviber.com/blog",
    siteName: "Superviber",
    images: [
      {
        url: "/images/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Superviber development blog — technical notes on multi-agent deliberation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alignment Dialogues Blog",
    description: "Technical blog on multi-agent deliberation systems development",
    images: ["/images/og-blog.jpg"],
  },
  alternates: {
    canonical: "https://superviber.com/blog"
  }
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 px-6 gradient-bg">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/alignment"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Alignment Dialogues
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Development Blog</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Technical posts documenting the design, implementation, and evolution
            of multi-agent alignment dialogues.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-zinc-300 mb-2">Coming Soon</h2>
              <p className="text-zinc-500 max-w-md mx-auto">
                We&apos;re working on our first posts. Check back soon for technical deep-dives
                into alignment dialogue architecture.
              </p>
              <Link
                href="/alignment/demo"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-full transition-colors"
              >
                Explore the Demo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.slug} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/30 transition-all">
                      <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        <span>-</span>
                        <span>{post.author}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-violet-300 transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-zinc-400 mb-4">{post.summary}</p>
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
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
