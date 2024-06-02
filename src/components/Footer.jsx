const Footer = () => {
  return (
    <footer className="bg-customBlue text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex md:flex-row justify-between items-center">
          {/* Footer Links */}
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold mb-2">Quick Links</h2>
            <ul className="sm:text-base flex flex-col gap-1">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/register" className="hover:underline">
                  Register
                </a>
              </li>
              <li>
                <a href="/pages/quiz/Pension" className="hover:underline">
                  Pension
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Information */}
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p>Email: leapfrog.testseries@gmail.com</p>
            <p>WhatsApp: +91 8368371597</p>
          </div>
          {/* Social Media Links */}
          <div className="hidden">
            <h2 className="text-lg font-bold mb-2 sm:text-xs">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-gray-400">
                Facebook
              </a>
              <a href="https://twitter.com" className="hover:text-gray-400">
                Twitter
              </a>
              <a href="https://instagram.com" className="hover:text-gray-400">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
