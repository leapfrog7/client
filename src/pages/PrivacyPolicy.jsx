const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md border border-gray-100">
        <div className="p-10">
          <header className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-gray-600 mb-4 tracking-tight flex gap-2 items-center justify-center">
              Privacy Policy 🔎
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Effective: <time dateTime="2023-01-01">March 1, 2025</time>
            </p>
          </header>

          <div className="prose prose-indigo max-w-none space-y-10 text-base lg:text-xl">
            <Section title="📌 Information We Collect">
              <div className="h-0.5 bg-blue-300 mb-4"></div>
              <p className="lead text-base lg:text-lg">
                We collect your <span className="font-bold">name, mobile </span>
                and <span className="font-bold">email id</span> for account
                identification, verification and to improve our service.
              </p>
            </Section>

            <Section title="🔧 How We Use Your Information">
              <div className="h-0.5 bg-blue-300 mb-4"></div>
              <ul className="space-y-3">
                <li>
                  Your account is identified based on the information we collect
                </li>
                <li>We analyze usage patterns via Google Analytics</li>
                <li>
                  Your details can be used to contact you in relation to your
                  account or this platform.
                </li>
              </ul>
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <h3 className="text-red-700 font-semibold mb-3">We Never:</h3>
                <ul className="space-y-2 text-red-700">
                  <li>• Sell or share personal data with third parties</li>
                  <li>
                    • Use data outside our platform&apos;s core functionality
                  </li>
                </ul>
              </div>
            </Section>

            <Section title="🌐 Cookies and Tracking">
              <div className="h-0.5 bg-blue-300 mb-4"></div>
              <p>
                We use essential and analytics cookies to ensure proper
                functionality and improve service quality:
              </p>
              <ul className="space-y-3">
                <ListItem title="Session Cookies">
                  Maintain secure user authentication
                </ListItem>
                <ListItem title="Analytics Cookies">
                  Track aggregated usage statistics through Google Analytics
                </ListItem>
              </ul>
            </Section>

            <Section title="🛡️ Data Security">
              <div className="h-0.5 bg-blue-300 mb-4"></div>
              <p>
                The platforms we use for serving our website implements
                enterprise-grade security measures including to protect your
                information.
              </p>
            </Section>

            <Section title="👤 Third-Party Services">
              <div className="h-0.5 bg-blue-300 mb-4"></div>
              <p>
                Our integration with Google Analytics helps us understand user
                engagement.
              </p>
            </Section>

            <Section title="⚖️ Your Rights">
              <div className="h-0.5 bg-blue-300 mb-4"></div>
              <ul className="space-y-3">
                <li>Access and update personal information</li>
                <li>Request data deletion</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
              <ContactLink />
            </Section>

            <Section title="🔄 Policy Updates">
              <div className="h-0.5 bg-blue-300 mb-4"></div>
              <p>
                We&apos;ll notify users of significant changes through platform
                announcements. Minor updates will be reflected by the revised
                date above.
              </p>
            </Section>

            <section>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                📩 Contact Information
              </h2>
              <div className="h-0.5 bg-blue-300 mb-2"></div>
              <div className="space-y-2">
                <ContactItem
                  label="Email"
                  value="leapfrog.testseries@gmail.com"
                />
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
};

// Reusable components
const Section = ({ title, children }) => (
  <section>
    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-1">
      {title}
    </h2>
    {children}
  </section>
);

const ListItem = ({ title, children }) => (
  <li className="flex gap-x-3">
    <span className="text-indigo-600">•</span>
    <div>
      <span className="font-medium text-gray-900">{title}:</span>{" "}
      <span className="text-gray-600">{children}</span>
    </div>
  </li>
);

const Link = ({ href, children }) => (
  <a
    href={href}
    className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium underline underline-offset-4"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

const ContactLink = () => (
  <p className="mt-4">
    Contact us at{" "}
    <Link href="mailto:leapfrog.testseries@gmail.com">
      leapfrog.testseries@gmail.com
    </Link>{" "}
    for any privacy-related requests.
  </p>
);

const ContactItem = ({ label, value }) => (
  <div className="flex gap-x-4">
    <dt className="w-32 flex-none text-gray-500">{label}</dt>
    <dd className="text-gray-700">{value}</dd>
  </div>
);

export default PrivacyPolicy;

import PropTypes from "prop-types";

// Add prop validation for all reusable components

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ContactItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

PrivacyPolicy.propTypes = {}; // Empty if no props

// ContactLink doesn't need prop validation as it has no props
