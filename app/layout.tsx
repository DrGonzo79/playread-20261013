import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {title: "PlayRead — Prototype diligence", description: "A fictional publisher greenlight workspace"};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
