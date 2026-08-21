import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WhatsAppFab from "@/components/WhatsAppFab";
import { company } from "@/lib/company";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kartikeyfastener.com"),
  title: {
    default: `${company.name} — Manufacturer of Quality Fasteners in MS & SS`,
    template: `%s — ${company.name}`,
  },
  description:
    "Kartikey Fasteners manufactures self tapping screws, machine screws, bolts, studs, rivets, nuts and washers in mild and stainless steel. ISO 9001:2015 and ISO 14001:2015 certified, Mohali, Punjab.",
  keywords: [
    "fastener manufacturer India",
    "self tapping screws",
    "machine screws",
    "hex bolt manufacturer",
    "MS SS fasteners",
    "Mohali Punjab fasteners",
    "cold forged screws",
  ],
  openGraph: {
    type: "website",
    siteName: company.name,
    title: `${company.name} — Manufacturer of Quality Fasteners`,
    description:
      "Cold forged, thread rolled, heat treated and plated in-house. ISO 9001:2015 and ISO 14001:2015 certified fastener manufacturing in Mohali, Punjab.",
  },
  icons: { icon: "/img/logo-256.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <head>
        {/*
          Without JavaScript the IntersectionObserver never runs, so nothing
          would ever get the .rv-in class and the page below the hero would stay
          blank. Content is not allowed to depend on scripting.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>.reveal,.reveal:not(.rv-in){opacity:1!important;transform:none!important;transition:none!important}</style>`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFab />
      </body>
    </html>
  );
}
