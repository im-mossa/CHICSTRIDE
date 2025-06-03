import "react-loading-skeleton/dist/skeleton.css";
import "./globals.css";
import HeaderContent from "./components/HeaderContent";
import FooterSection from "./components/FooterSection";

export const metadata = {
  title: "CHICSTRIDE",
  description: "A clothing store site built with Next.js",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
    icon: "/icon.PNG",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="rtl">
      <body>
        {/* نوار ناوبری به صورت fixed */}
        <header
          data-testid="header"
          className="border-b border-gray-200 fixed top-0 left-0 w-full z-20 animate-slide-down"
        >
          <nav className="h-20 flex justify-center items-center text-xl header-section">
            <HeaderContent />
          </nav>
        </header>

        {/* افزودن padding-top به main به دلیل وجود نوار ناوبری fixed */}
        <main className="flex-1 pt-20" data-testid="main">
          {children}
        </main>

        <footer data-testid="footer">
          <FooterSection />
        </footer>
      </body>
    </html>
  );
}
