export const metadata = {
  title: "Symbiosis Vault",
  description: "NFC Collectible Series — Jack & Jack",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#0C0B0E",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Symbiosis Vault",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#000" }}>
        {children}
      </body>
    </html>
  );
}
