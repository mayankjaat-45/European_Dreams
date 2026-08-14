"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import MotionController from "@/components/motion/MotionController";

export default function AppShell({ children, footer }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <MotionController />
      <Navbar />

      <main>{children}</main>

      {footer}
    </>
  );
}
