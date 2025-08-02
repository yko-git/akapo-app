"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoginContext } from "@/components/shared/loginContext";
import { jwtDecode } from "jwt-decode";
import { Inter } from "next/font/google";
import Header from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const publicPaths = ["/login", "/signup", "/about"];

    if (!token) {
      setIsLoggedIn(false);
      if (!publicPaths.includes(pathname)) {
        router.push("/login");
      }
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        if (!publicPaths.includes(pathname)) {
          router.push("/login");
        }
      } else {
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error("JWTの解析に失敗:", e);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      if (!publicPaths.includes(pathname)) {
        router.push("/login");
      }
    }
  }, [pathname]);

  return (
    <html lang="ja">
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </LoginContext.Provider>
    </html>
  );
}
