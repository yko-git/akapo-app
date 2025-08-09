"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoginContext } from "@/components/shared/loginContext";
import { jwtDecode } from "jwt-decode";
import { Inter } from "next/font/google";
import Header from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { MySuccessIcon } from "@/components/shared/icons/good";

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
          <Toaster
            toastOptions={{
              duration: 5000,
              style: {
                borderRadius: "8px",
                background: "#fff",
                border: "2px solid #6C9FE0",
                color: "#6C9FE0",
                fontSize: "18px",
                padding: "15px",
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
