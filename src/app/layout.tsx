import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./lib/ThemeProvider";
import { LocaleProvider } from "./lib/LocaleProvider";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import Providers from "./lib/Providers";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export async function generateMetadata(): Promise<Metadata> {
//   // For the root layout, we want the default values, so we call without parameters
//   return generateDynamicMetadata();
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {" "}
          <ThemeProvider
            defaultTheme="dark"
            storageKey={`${appConfiguration.appCode}theme`}
          >
            <LocaleProvider>{children}</LocaleProvider>
          </ThemeProvider>
          <Toaster/>
        </Providers>
      </body>
    </html>
  );
}

