import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { icons } from "lucide-react";
import { useState } from "react";
import MainDashboard from "./MainDashboard";
import DaftarLombaSection from "../daftarlomba/DaftarLombaSection";
import ProfileSection from "../profile/ProfileSection";
import SubmissionSection from "./SubmissionSection";
import Penilaian from "./Penilaian";

const DashboardPesertaSection: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [openSide, setOpenSide] = useState<string>("dashboard");
  const renderContent = () => {
    switch (openSide) {
      case "dashboard":
        return <MainDashboard />;
      case "daftarlomba":
        return <DaftarLombaSection />;
      case "profile":
        return <ProfileSection />;
      case "submission":
        return <SubmissionSection/>
      case "penilaian":
        return <Penilaian/>
    }
  };
  return (
    <div className="flex">
      <SidebarProvider
        defaultOpen={open}
        open={open}
        onOpenChange={() => setOpen(!open)}
      >
        <Sidebar>
          <SidebarContent className="bg-[#1E40AF]">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white font-extrabold text-xl">
                Peserta Lomba{" "}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="mt-8">
                  <SidebarMenuItem key="dashboard">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("dashboard")}
                    >
                      <icons.House className="text-white" />
                      <span className="text-white font-bold">Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem key="daftarlomba">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("daftarlomba")}
                    >
                      <icons.Trophy className="text-white" />
                      <span className="text-white font-bold">Daftar Lomba</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem key="juri">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("submission")}
                    >
                      <icons.FileCheck className="text-white" />
                      <span className="text-white font-bold">Submission</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem key="users">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("penilaian")}
                    >
                      <icons.ClipboardList className="text-white" />
                      <span className="text-white font-bold">Penilaian</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem key="profile">
                    <SidebarMenuButton
                      className="hover:bg-[#2E4EC5]"
                      onClick={() => setOpenSide("profile")}
                    >
                      <icons.UserRound className="text-white" />
                      <span className="text-white font-bold">Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>

      <div className="flex-1 p-4">{renderContent()}</div>
    </div>
  );
};
export default DashboardPesertaSection;
