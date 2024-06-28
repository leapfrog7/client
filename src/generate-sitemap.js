import { writeFileSync } from "fs";
import { SitemapStream, streamToPromise } from "sitemap";

// List your routes here
const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/register", changefreq: "weekly", priority: 0.8 },
  { url: "/login", changefreq: "weekly", priority: 0.8 },
  {
    url: "/pages/quiz/paper-i/Constitution",
    changefreq: "weekly",
    priority: 0.8,
  },
  { url: "/pages/quiz/paper-i/rti-act", changefreq: "weekly", priority: 0.8 },
  { url: "/pages/quiz/paper-i/dfpr", changefreq: "weekly", priority: 0.8 },
  {
    url: "/pages/quiz/paper-i/parliamentary-procedure",
    changefreq: "weekly",
    priority: 0.8,
  },
  { url: "/pages/quiz/paper-i/aobr", changefreq: "weekly", priority: 0.8 },
  { url: "/pages/quiz/paper-i/complete", changefreq: "weekly", priority: 0.8 },
  { url: "/pages/quiz/paper-i/lookup", changefreq: "weekly", priority: 0.8 },
  {
    url: "/pages/quiz/paper-ii/leave-rules",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    url: "/pages/quiz/paper-ii/conduct-rules",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    url: "/pages/quiz/paper-ii/ccs-cca-rules",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    url: "/pages/quiz/paper-ii/pension-rules",
    changefreq: "weekly",
    priority: 0.8,
  },
  { url: "/pages/quiz/paper-ii/gfr", changefreq: "weekly", priority: 0.8 },
  { url: "/pages/quiz/paper-ii/csmop", changefreq: "weekly", priority: 0.8 },

  // Add other routes here
];

const sitemapStream = new SitemapStream({
  hostname: "https://undersigned.netlify.app/",
});

streamToPromise(sitemapStream.pipe(writeFileSync("./public/sitemap.xml")))
  .then(() => console.log("Sitemap generated successfully!"))
  .catch((error) => console.error("Error generating sitemap", error));

links.forEach((link) => {
  sitemapStream.write(link);
});

sitemapStream.end();
