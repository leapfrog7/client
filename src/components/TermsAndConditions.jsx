const TermsAndConditions = () => {
  return (
    <div className="mx-auto p-2 lg:p-4 bg-white rounded-lg ">
      <header className="mb-6 text-center">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          ✍️ Terms & Conditions
        </h1>
        <div className="w-20 h-0.5 lg:h-1 bg-blue-500 mx-auto rounded-full"></div>
      </header>

      <div className="space-y-4">
        <section>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-b-blue-300">
            🔐 Subscription & Account Usage
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm lg:text-base mb-10">
            <li>
              The subscription is issued <strong>exclusively</strong> for a
              single mobile number and is <strong>non-transferable</strong>.
            </li>
            <li>
              Sharing or distributing login credentials with others{" "}
              <strong>violates these Terms & Conditions</strong> and may result
              in immediate <strong>suspension</strong> or{" "}
              <strong>termination</strong> of the account{" "}
              <strong>without refund</strong>.
            </li>
            <li>
              The platform reserves the right to monitor accounts for
              unauthorized access or unusual activity.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-b-blue-300">
            ⛓️‍💥 Refund & Cancellation Policy
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm lg:text-base mb-10">
            <li>
              All subscription payments are{" "}
              <strong>final and non-refundable</strong>.
            </li>
            <li>
              No request for refunds, cancellations, or transfers of the paid
              amount will be entertained under any circumstances.
            </li>
            <li>
              Users are encouraged to review the subscription details before
              making a payment.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-b-blue-300">
            📆 Subscription Validity
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm lg:text-base mb-10">
            <li>
              The subscription is valid for the{" "}
              <strong>LDCE 2026 examination</strong>.
            </li>
            <li>
              If you are <strong>unsuccessful in LDCE 2026</strong>, your
              subscription will be{" "}
              <strong>extended automatically to cover LDCE 2027</strong> at no
              additional cost.
            </li>
            <li>
              To avail the extension, users must provide their
              <strong> Roll Number</strong> and <strong>Date of Birth</strong>{" "}
              for verification of results.
            </li>
            <li>
              If you successfully clear LDCE 2026, the subscription will
              conclude at that point.
            </li>
            <li>
              The subscription does not carry a fixed two-year limit — it is
              tied to your <strong>exam attempt(s)</strong> (LDCE 2026, and if
              required, LDCE 2027).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-b-blue-300">
            🏷️ Pricing & Changes
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm lg:text-base mb-10">
            <li>
              <strong>Subscription prices</strong> are subject to change without
              prior notice.
            </li>
            <li>
              The price applicable to your purchase will be the{" "}
              <strong>price displayed at the time of payment</strong>.
            </li>
            <li>
              Any <strong>promotions, discounts, or offers</strong> are subject
              to change or discontinuation at the discretion of the platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-b-blue-300">
            😎 User Responsibilities
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm lg:text-base mb-10">
            <li>
              Users must{" "}
              <strong>
                not engage in unauthorized distribution, reselling, or
                commercial use
              </strong>{" "}
              of the platform&apos;s content.
            </li>
            <li>
              Any attempt to <strong>manipulate the platform</strong>, misuse
              services, or violate these terms may result in{" "}
              <strong>account suspension without refund</strong>.
            </li>
            <li>
              Users agree to comply with all applicable laws and regulations
              while using the platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-b-blue-300">
            🛠️ Modifications to Terms
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm lg:text-base mb-10">
            <li>
              The platform <strong>reserves the right to modify</strong> these
              Terms & Conditions at any time.
            </li>
            <li>
              Continued use of the platform after changes are made constitutes{" "}
              <strong>acceptance of the revised Terms & Conditions</strong>.
            </li>
            <li>
              Users are encouraged to{" "}
              <strong>review these terms periodically</strong> for updates.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
