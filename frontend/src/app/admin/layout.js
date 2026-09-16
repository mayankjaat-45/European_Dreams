import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRouteLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
