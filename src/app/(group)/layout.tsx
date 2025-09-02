import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import HeaderComponent from "@/components/header/header";

export const metadata: Metadata = {
  title: "GramPilot",
  description: "Your own instagram post scheduler plus analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="overflow-hidden">
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HeaderComponent />
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
