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
import { useEffect, useState } from "react";
import MainDashboard from "./MainDashboard";
import DaftarLombaSection from "../daftarlomba/DaftarLombaSection";
import ProfileSection from "../profile/ProfileSection";
import SubmissionSection from "./SubmissionSection";
import Penilaian from "./Penilaian";
import { motion } from "framer-motion";

interface profile {
  id: string;
  nama: string;
  email: string;
  role: string;
}

const DashboardPesertaSection: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [openSide, setOpenSide] = useState<string>("dashboard");
  const [profile, setProfile] = useState<profile>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://hono-api-lomba-tif-production.up.railway.app/auth/me",
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const renderContent = () => {
    switch (openSide) {
      case "dashboard":
        return <MainDashboard />;
      case "daftarlomba":
        return <DaftarLombaSection />;
      case "profile":
        return <ProfileSection />;
      case "submission":
        return <SubmissionSection />;
      case "penilaian":
        return <Penilaian />;
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
            <motion.div
              className="p-4 border-t border-blue-600 mt-auto"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <icons.User className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{profile?.nama}</p>
                  <p className="text-sm text-blue-200">{profile?.role}</p>
                </div>
              </div>
            </motion.div>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>

      <div className="flex-1 p-4">{renderContent()}</div>
    </div>
  );
};
export default DashboardPesertaSection;
