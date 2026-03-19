import { getAllPages } from "@/lib/pages";
import AdminDashboard from "@/components/features/AdminDashboard";

export default function AdminPage() {
  const pages = getAllPages(true); // Include disabled pages for admin

  return (
    <div className="bg-muted/5 min-h-screen">
      <AdminDashboard pages={pages} />
    </div>
  );
}
