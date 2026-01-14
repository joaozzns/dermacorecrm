import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <div className="flex-1 ml-64">
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
