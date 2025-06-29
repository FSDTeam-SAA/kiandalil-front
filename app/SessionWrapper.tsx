"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function SessionWrapper({ children }: { children: ReactNode }) {


  const shouldHide = "/dashboard"

  const pathname = usePathname()



  return (
    <SessionProvider>
      {
        !pathname.includes(shouldHide) && <Header />
      }
      {children}
      {
        !pathname.includes(shouldHide) && <Footer />
      }
    </SessionProvider>
  )
}
