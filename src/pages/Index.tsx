import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <Dashboard />
    </DashboardLayout>
  );
};

export default Index;
