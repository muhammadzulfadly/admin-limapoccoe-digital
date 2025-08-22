import PropTypes from "prop-types";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="x3noKRLIxWyin4AxcIX2IqDaZsEU8JzZsWhyU9j9fAI" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>{children}</body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
