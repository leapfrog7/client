import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [query, setQuery] = useState("");

  const faqs = useMemo(
    () => [
      {
        question: "What is the purpose of this website?",
        answer:
          "UnderSigned helps LDCE aspirants prepare smarter not only through exam-oriented MCQs and progress tracking, but also through practical resources and productivity tools that support revision and day-to-day work efficiency.",
      },
      {
        question: "What topics are covered in the quizzes?",
        answer:
          "We cover topics for both Paper I and Paper II as listed on the website. The quizzes are structured to cover essential topics comprehensively.",
      },
      {
        question: "What is the Pricing Structure?",
        answer:
          "We currently offer a single subscription plan priced at ₹699/- till notification of LDCE 2026. This includes access to all topics under Paper I and Paper II, along with Previous Year Questions. New content and updates are available at no extra charge. Pricing may change without prior notice. The prices will be raised once notification is published.",
      },
      {
        question: "What is the validity period of my account?",
        answer:
          "Your account remains valid through the LDCE 2026 examination. If you do not clear LDCE 2026, your subscription is automatically extended to cover LDCE 2027 at no additional cost.",
      },
      {
        question: "When can I expect Discounts?",
        answer:
          "The subscription is already offered at a low rate of ₹699/- for now. Hence, further discounts are untenable. The prices are subject to change without any notice. ",
      },
      {
        question: "Is there any discount for renewal of subscription?",
        answer:
          "Yes. We offer a 50% discount to previous subscribers if they renew within 3 months after expiry.",
      },
      {
        question: "When should I buy this subscription?",
        answer:
          "If you’re eligible for the upcoming LDCE exam, subscribing early helps you practice more, track progress over time, and revise effectively.",
      },
      {
        question: "How do I make a payment?",
        answer:
          "Currently, we accept payments via UPI. Make the payment and share a screenshot of the transaction on the provided WhatsApp number for activation.",
      },
      {
        question: "How can I track my progress?",
        answer:
          "Your dashboard shows topic-wise progress and quiz attempts so you can identify weak areas and revise strategically.",
      },
      {
        question: "Can I bookmark important questions?",
        answer:
          "Yes. You can bookmark questions topic-wise for quick revision later.",
      },
      {
        question: "What quiz options are available?",
        answer:
          "You can attempt unattempted questions (to avoid repetition) or take randomized sets (e.g., 10 random questions from a topic).",
      },
      {
        question: "Why is there sometimes a delay in loading questions?",
        answer:
          "Questions are fetched from a cloud database via server APIs. A slow connection or temporary server load can cause small delays.",
      },
      {
        question: "How long does it take to activate my account after payment?",
        answer:
          "Activation is usually quick but may sometimes take longer depending on availability. You can always ping us on WhatsApp for a confirmation.",
      },
      {
        question: "How will I know if my account is activated?",
        answer:
          "We confirm activation via WhatsApp. After activation, please log in again and you’ll have access to the paid modules.",
      },
      {
        question: "What should I do if I have issues or need clarification?",
        answer:
          "Message us on WhatsApp. We’ll help you resolve issues quickly and ensure a smooth experience.",
      },
      {
        question: "Can I get a refund if I decide to cancel my subscription?",
        answer:
          "Refunds are not offered after payment and activation. We encourage users to explore available free content first and subscribe if it fits their needs.",
      },
    ],
    [],
  );

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      ({ question, answer }) =>
        question.toLowerCase().includes(q) || answer.toLowerCase().includes(q),
    );
  }, [faqs, query]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#faq-")) {
      const idx = parseInt(hash.replace("#faq-", ""), 10);
      if (!Number.isNaN(idx)) setOpenIndex(idx);
    }
  }, []);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);
  const expandAll = () => setOpenIndex("ALL");
  const collapseAll = () => setOpenIndex(null);
  const isOpen = (index) => openIndex === "ALL" || openIndex === index;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Helmet>
        <title>FAQs | UnderSigned</title>
        <meta
          name="description"
          content="FAQs for UnderSigned: registration, login, subscription/payment, accessing MCQs and tools, bookmarks, progress tracking, and common troubleshooting."
        />
        <link rel="canonical" href="https://undersigned.in/FAQs" />
        <meta
          name="robots"
          content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UnderSigned" />
        <meta property="og:title" content="FAQs | UnderSigned" />
        <meta
          property="og:description"
          content="Find answers about registration, subscription/payment, using MCQs & tools, bookmarks, progress tracking, and troubleshooting on UnderSigned."
        />
        <meta property="og:url" content="https://undersigned.in/FAQs" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FAQs | UnderSigned" />
        <meta
          name="twitter:description"
          content="Answers about registration, subscription/payment, MCQs & tools, bookmarks, progress tracking, and troubleshooting on UnderSigned."
        />

        {/* If you later want, we can generate full FAQ schema JSON-LD dynamically */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
          }
        `}</script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <header className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-800 via-indigo-700 to-cyan-600" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Frequently Asked Questions
                </h1>
                <p className="mt-1 text-sm sm:text-base text-slate-600">
                  Quick answers about login, subscription, quizzes, tools, and
                  troubleshooting.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  Expand all
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  Collapse
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mt-5">
              <label htmlFor="faq-search" className="sr-only">
                Search FAQs
              </label>
              <div className="relative">
                <input
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search (pricing, renewal, payment, bookmarks, PYQ)…"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm sm:text-base
                             focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  ⌘
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredFaqs.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {faqs.length}
                </span>{" "}
                questions
              </div>
            </div>
          </div>
        </header>

        {/* Results */}
        <section className="mt-6">
          {filteredFaqs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              <div className="text-lg font-semibold text-slate-900">
                No results
              </div>
              <p className="mt-1 text-sm">
                Try different keywords (e.g., “payment”, “validity”, “PYQ”).
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const originalIndex = faqs.indexOf(faq);
                const panelId = `faq-panel-${originalIndex}`;
                const btnId = `faq-button-${originalIndex}`;
                const open = isOpen(originalIndex);

                return (
                  <div
                    key={originalIndex}
                    id={`faq-${originalIndex}`}
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                  >
                    <button
                      id={btnId}
                      onClick={() => toggle(originalIndex)}
                      aria-expanded={open}
                      aria-controls={panelId}
                      className="
                        w-full text-left
                        px-5 py-4
                        flex items-start justify-between gap-4
                        hover:bg-slate-50 transition
                        focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
                      "
                    >
                      <span className="text-sm sm:text-base font-semibold text-slate-900">
                        {faq.question}
                      </span>

                      <span
                        className={[
                          "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl border",
                          open
                            ? "border-cyan-200 bg-cyan-50 text-cyan-800"
                            : "border-slate-200 bg-white text-slate-600",
                        ].join(" ")}
                        aria-hidden="true"
                        title={open ? "Collapse" : "Expand"}
                      >
                        <svg
                          className={`h-4 w-4 transition-transform ${
                            open ? "rotate-180" : "rotate-0"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.92 1.18l-4.25 3.37a.75.75 0 01-.92 0L5.21 8.41a.75.75 0 01.02-1.2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className={`
                        overflow-hidden transition-all duration-200
                        ${open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}
                      `}
                    >
                      <div className="px-5 pb-5 text-sm sm:text-base text-slate-700 leading-relaxed">
                        <div className="mt-1 rounded-xl bg-slate-50 border border-slate-200 p-4">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer note */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Still stuck? Reach out via WhatsApp (as mentioned on the site) and
          we’ll help.
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
