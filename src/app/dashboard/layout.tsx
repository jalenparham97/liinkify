import { DashboardLayout } from "@/components/dashboard/dashboard-layout-stacked";
// import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      <div>{children}</div>
    </DashboardLayout>
  );
}
