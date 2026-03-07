"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoginContext } from "@/shared/components/loginContext";
import { jwtDecode } from "jwt-decode";
import { Inter } from "next/font/google";
import Header from "@/shared/components/header";
import { Footer } from "@/shared/components/footer";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { MySuccessIcon } from "@/shared/components/icons/good";

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
  }, [pathname, router]);

  return (
    <html lang="ja">
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <body className={inter.className}>
          <Header />
          <Toaster
            toastOptions={{
              duration: 5000,
              style: {
                borderRadius: "8px",
                background: "#fff",
                color: "#6C9FE0",
                fontSize: "14px",
                padding: "10px 20px",
              },
              success: {
                icon: <MySuccessIcon />,
                style: {
                  background: "#fff",
                  border: "2px solid #6C9FE0",
                  color: "#6C9FE0",
                },
              },
              error: {
                style: {
                  background: "red",
                  color: "#fff",
                },
                iconTheme: {
                  primary: "white",
                  secondary: "red",
                },
              },
            }}
          />
          {children}
          <Footer />
        </body>
      </LoginContext.Provider>
    </html>
  );
}
