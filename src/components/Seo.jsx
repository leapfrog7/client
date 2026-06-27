import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "UnderSigned";
const SITE_URL = "https://www.undersigned.in";

function buildAbsoluteUrl(path = "") {
  if (!path) return SITE_URL;

  if (path.startsWith("http")) return path;

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function Seo({
  title,
  description,
  path = "",
  noIndex = false,
  image = "",
  type = "website",
}) {
  const finalTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = buildAbsoluteUrl(path);
  const imageUrl = image ? buildAbsoluteUrl(image) : "";

  return (
    <Helmet>
      <title>{finalTitle}</title>

      {description ? <meta name="description" content={description} /> : null}

      <link rel="canonical" href={canonicalUrl} />

      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:url" content={canonicalUrl} />

      {description ? (
        <meta property="og:description" content={description} />
      ) : null}

      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}

      <meta
        name="twitter:card"
        content={imageUrl ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={finalTitle} />

      {description ? (
        <meta name="twitter:description" content={description} />
      ) : null}

      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
    </Helmet>
  );
}

Seo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  path: PropTypes.string,
  noIndex: PropTypes.bool,
  image: PropTypes.string,
  type: PropTypes.string,
};

export default Seo;
