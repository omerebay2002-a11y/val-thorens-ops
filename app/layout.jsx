import { Heebo } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-heebo",
  display: "swap",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  title: "Val Thorens Ops",
  description: "ניהול ובדיקת דירות בוואל טורנס",
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Val Thorens",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href={`${basePath}/icons/icon.svg`} />
        <link rel="apple-touch-icon" href={`${basePath}/icons/icon.svg`} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "12px",
              direction: "rtl",
            },
            duration: 2500,
          }}
        />
      </body>
    </html>
  );
}
