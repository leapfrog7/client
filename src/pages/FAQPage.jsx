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
          "Our website is designed to help LDCE (Limited Departmental Competitive Exam) aspirants excel in their exams with a wide range of quizzes tailored specifically for the exam conducted by UPSC for Section Officers (SO).",
      },
      {
        question: "What topics are covered in the quizzes?",
        answer:
          "We cover topics for both Paper I and Paper II as listed on our website. The quizzes are structured to cover all essential topics comprehensively. Only the topics mentioned on our website are available at present.",
      },
      {
        question: "What is the Pricing Structure?",
        answer:
          "We currently offer a single subscription plan priced at ₹999/-. This subscription includes access to all topics under Paper I and Paper II, as listed on our website, along with Previous Year Questions. Additionally, any updates or new content added to the portal will be accessible at no extra charge. Please note that the pricing is subject to change without prior notice.",
      },
      {
        question: "What is the validity period of my account?",
        answer:
          "Your account will remain valid through the LDCE 2025 examination. If you do not clear LDCE 2025, your subscription will be automatically extended to cover LDCE 2026 at no additional cost. There is no fixed two-year limit — your validity is tied to the exam cycle.",
      },
      {
        question: "When can I expect Discounts?",
        answer:
          "Our subscription is already offered at a discounted rate of ₹999/-. Given this competitive pricing, we are unable to provide any further discounts.",
      },
      {
        question: "Is there any discounts for renewal of subscription?",
        answer:
          "Yes, we offer a 50% discount to our previous subscribers if they choose to renew their subscription within 3 months after it expires.",
      },
      {
        question: "When should I buy this subscription?",
        answer:
          "If you are eligible for the upcoming LDCE exam, the best time to subscribe is now. Early access allows you to practice more and track your progress over time. Your subscription will stay valid through LDCE 2025, and if you don’t clear it, we’ll automatically extend your access to cover LDCE 2026 at no extra cost.",
      },
      {
        question: "How do I make a payment?",
        answer:
          "Currently, we only accept payments through UPI. You need to make the payment via UPI and share a screenshot of the transaction on the provided WhatsApp number.",
      },
      {
        question: "How can I track my progress?",
        answer:
          "You can track your progress through the user dashboard, which provides an overview of your quiz completion status and topic-wise quiz attempted so far.",
      },
      {
        question: "Can I bookmark important questions?",
        answer:
          "Yes, you can bookmark any quiz question. These bookmarks will appear under the bookmarks tab for the specific topic, allowing easy access to important questions.",
      },
      {
        question: "What are the quiz options available?",
        answer:
          "You have the option to choose from unattempted questions to ensure no quiz is repeated. Alternatively, you can select randomized questions, which will fetch 10 questions randomly from the chosen topic.",
      },
      {
        question: "Why is there sometimes a delay in loading questions?",
        answer:
          "Since the questions are stored in a cloud database and accessed through the server, there can be a slight delay. We recommend having a high-speed internet connection for the best experience.",
      },
      {
        question: "How long does it take to activate my account after payment?",
        answer:
          "Account activation may take a few minutes; at times it might take longer if we’re occupied. Rest assured, your account will be activated. We’re available on WhatsApp for any queries.",
      },
      {
        question: "How will I know if my account is activated?",
        answer:
          "Once your account is activated, we’ll confirm via WhatsApp and you’ll need to log in again. You can also message us on WhatsApp for any confirmation.",
      },
      {
        question:
          "What should I do if I have any issues or need clarification?",
        answer:
          "For any queries or clarifications, feel free to reach out to us on WhatsApp. We’re here to help and ensure you have a smooth experience.",
      },
      {
        question: "Can I get a refund if I decide to cancel my subscription?",
        answer:
          "We do not offer refunds once payment is made and the account is activated. We encourage all users to try the free trial and purchase if you find it valuable for your preparation.",
      },
    ],
    []
  );

  // Filter by query (question + answer)
  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      ({ question, answer }) =>
        question.toLowerCase().includes(q) || answer.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  // Open item from hash (#faq-3)
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
    <div className="max-w-4xl mx-auto p-4">
      <Helmet>
        <title>FAQ - UnderSigned</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about UnderSigned. How to register, subscribe, pay, and use MCQ tools."
        />
        <link rel="canonical" href="https://undersigned.in/FAQs" />
        <meta property="og:title" content="FAQ - UnderSigned" />
        <meta
          property="og:description"
          content="Find answers to frequently asked questions about UnderSigned."
        />
        <meta property="og:url" content="https://undersigned.in/FAQs" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Header */}
      <header className="bg-white rounded-md mb-4 md:mb-6">
        <h1 className="text-center text-lg md:text-xl lg:text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <span className="text-customBlue">Frequently Asked Questions</span>
          <img
            src="/faq.png"
            alt="FAQ"
            width={60}
            height={60}
            loading="lazy"
            className="inline-block"
          />
        </h1>

        {/* Search + controls */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <label htmlFor="faq-search" className="sr-only">
              Search FAQs
            </label>
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions (e.g. pricing, renewal, PYQ)…"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              ⌘K
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50"
            >
              Collapse all
            </button>
          </div>
        </div>
      </header>

      {/* List */}
      <div>
        {filteredFaqs.length === 0 && (
          <p className="text-sm text-gray-500 mt-4">
            No results. Try different keywords.
          </p>
        )}

        {filteredFaqs.map((faq) => {
          // Map filtered index back to original index for stable hashes
          const originalIndex = faqs.indexOf(faq);
          const panelId = `faq-panel-${originalIndex}`;
          const btnId = `faq-button-${originalIndex}`;
          const open = isOpen(originalIndex);

          return (
            <div
              key={originalIndex}
              id={`faq-${originalIndex}`}
              className="mb-3"
            >
              <button
                id={btnId}
                onClick={() => toggle(originalIndex)}
                aria-expanded={open}
                aria-controls={panelId}
                className="
                  w-full text-left cursor-pointer
                  bg-gradient-to-r from-teal-50 to-teal-100
                  p-4 rounded-lg border border-teal-200
                  text-teal-900 hover:from-teal-100 hover:to-teal-100
                  transition
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                  flex items-center justify-between gap-3
                "
              >
                <span className="text-sm md:text-base xl:text-lg font-semibold">
                  {faq.question}
                </span>
                <svg
                  className={`h-5 w-5 text-teal-700 transition-transform ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.92 1.18l-4.25 3.37a.75.75 0 01-.92 0L5.21 8.41a.75.75 0 01.02-1.2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={`
                  overflow-hidden transition-all duration-200
                  ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
                `}
              >
                <div className="bg-white px-4 py-3 border-l-4 border-teal-300 text-teal-900 rounded-b-lg shadow-sm text-sm md:text-base xl:text-lg">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQPage;
