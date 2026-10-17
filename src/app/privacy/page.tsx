import type { Metadata } from "next";

const description =
  "How Superviber handles data on this website and in its tools, including data from Google APIs.";

export const metadata: Metadata = {
  title: "Privacy Policy - SuperViber",
  description,
  alternates: {
    canonical: "https://superviber.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-zinc-400 mb-12">Last updated: October 16, 2026</p>

          <div className="space-y-10 text-lg text-zinc-300 leading-relaxed">
            <section className="space-y-4">
              <p>
                This policy covers the website at superviber.com and the software tools that
                Superviber, Inc. (&ldquo;Superviber&rdquo;, &ldquo;we&rdquo;) publishes, including
                trellis. It says what data each one handles, where that data goes, and how you can
                remove it.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">This website</h2>
              <p>
                The website is hosted on Vercel. Vercel keeps standard request logs, such as IP
                addresses and the pages requested, to run and protect the service. We do not use
                advertising trackers. If you write to us, we keep your message and your address to
                answer you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Our tools and Google user data</h2>
              <p>
                Some of our tools can connect to a Google account, when you choose to sign in with
                it. They ask for read-only access to Gmail and Google Calendar, so that the tool can
                read your mail and your events for you.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The data stays on your own computer. The tool reads it there, and it does not send
                  it to Superviber&rsquo;s servers.
                </li>
                <li>
                  The sign-in token is kept in your computer&rsquo;s keychain, not on our servers.
                </li>
                <li>
                  We do not sell Google user data, use it for advertising, or give it to anyone
                  else.
                </li>
                <li>
                  No person at Superviber reads your Google user data.
                </li>
              </ul>
              <p>
                Superviber&rsquo;s use and transfer to any other app of information received from
                Google APIs will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  className="text-violet-400 hover:text-violet-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <p>
                You can remove a tool&rsquo;s access at any time in your Google Account, under
                Security, &ldquo;Your connections to third-party apps &amp; services&rdquo;.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Contact</h2>
              <p>
                Questions about this policy go to{" "}
                <a
                  href="mailto:admin@superviber.com"
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  admin@superviber.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
