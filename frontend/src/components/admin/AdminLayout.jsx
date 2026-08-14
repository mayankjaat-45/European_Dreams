"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAdminToken } from "@/services/admin-auth.service";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin";

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    const token = getAdminToken();

    if (!token) {
      router.replace("/admin");
      return;
    }

    setCheckingAuth(false);
  }, [isLoginPage, pathname, router]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // The /admin route is the login page.
  if (isLoginPage) {
    return children;
  }

  if (checkingAuth) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin text-primary" size={34} />

          <p className="text-sm font-medium text-muted">
            Verifying your admin session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggleCollapse={() =>
          setSidebarCollapsed((currentValue) => !currentValue)
        }
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div
        className={`min-h-dvh transition-[padding] duration-300 ease-out ${
          sidebarCollapsed ? "lg:pl-23" : "lg:pl-70"
        }`}
      >
        <AdminHeader onOpenMobile={() => setMobileSidebarOpen(true)} />

        <main className="min-h-[calc(100dvh-80px)] p-4 sm:p-6 xl:p-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
