import { AuthProvider } from "../components/AuthContext";

export const metadata = {
  title: "Symbiosis Vault",
  description: "NFC Collectible Series — Jack & Jack",
  themeColor: "#0C0B0E",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Symbiosis Vault",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/vault-logo.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#000", overscrollBehavior: "none" }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
