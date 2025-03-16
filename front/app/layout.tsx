"use client";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { useEffect, useState } from "react";
import { LoginContext } from "@/components/shared/loginContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <html lang="en">
      <LoginContext.Provider value={isLoggedIn}>
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </LoginContext.Provider>
    </html>
  );
}
