import { DashboardLayout } from "@/components/dashboard/dashboard-layout-stacked";
// import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      <div className="min-h-full bg-gray-50 pt-16">{children}</div>
    </DashboardLayout>
  );
}
