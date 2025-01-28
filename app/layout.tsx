import "./globals.css";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "Billbuddy",
  description: "Parse your credit card statements and export to CSV",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} min-h-screen flex flex-col`}>
        <header className="p-4 text-foreground border-b border-foreground">
          <h1 className="text-2xl font-bold text-center">Billbuddy</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
