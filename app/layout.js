import PropTypes from "prop-types";

export const metadata = {
  title: 'Admin LimapoccoeDigital',
  description: 'Website Resmi Desa Limmapocoe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};