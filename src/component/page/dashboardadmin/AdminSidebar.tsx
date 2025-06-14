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
import { motion } from "framer-motion"; // Import motion from Framer Motion

import UsersSection from "./UsersSection";
import DaftarLombaAdmin from "./DaftarLombaAdmin";
import PesertaSection from "./PesrtaSection";
import DaftarJuriaAdmin from "./DaftarJuriaAdmin";
import { DashboardSection } from "./DasboardSection";
import ProfileSection from "../profile/ProfileSection";
import LombaSertifikat from "./LombaSertifikat";

interface profile {
  id: string;
  nama: string;
  email: string;
  role: string;
}

function AdminSidebar() {
  const [open, setOpen] = useState(true);
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


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const renderContent = () => {
    switch (openSide) {
      case "peserta":
        return <PesertaSection />;
      case "users":
        return <UsersSection />;
      case "daftar-lomba":
        return <DaftarLombaAdmin />;
      case "juri":
        return <DaftarJuriaAdmin />;
      case "dashboard":
        return <DashboardSection/>
      case "profile":
        return <ProfileSection/>
      case "sertifikat":
        return <LombaSertifikat/>
      default:
        return <DashboardSection/>
    }
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row w-full min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SidebarProvider
        defaultOpen={open}
        open={open}
        onOpenChange={() => setOpen(!open)}
      >
        <Sidebar>
          <SidebarContent className="bg-[#1E40AF]">
            <SidebarGroup>
              <motion.div variants={itemVariants}>
                <SidebarGroupLabel className="text-white font-extrabold text-xl">
                  Admin Lomba{" "}
                </SidebarGroupLabel>
              </motion.div>
              <SidebarGroupContent>
                <SidebarMenu className="mt-8">
                  <motion.div variants={itemVariants}>
                    <SidebarMenuItem key="dashboard">
                      <SidebarMenuButton
                        className="hover:bg-[#2E4EC5]"
                        onClick={() => setOpenSide("dashboard")}
                      >
                        <icons.House className="text-white" />
                        <span className="text-white font-bold">Dashboard</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <SidebarMenuItem key="daftar-lomba">
                      <SidebarMenuButton
                        className="hover:bg-[#2E4EC5]"
                        onClick={() => setOpenSide("daftar-lomba")}
                      >
                        <icons.Trophy className="text-white" />
                        <span className="text-white font-bold">
                          Daftar Lomba
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <SidebarMenuItem key="peserta">
                      <SidebarMenuButton
                        className="hover:bg-[#2E4EC5]"
                        onClick={() => setOpenSide("peserta")}
                      >
                        <icons.Users className="text-white" />
                        <span className="text-white font-bold">Peserta</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <SidebarMenuItem key="juri">
                      <SidebarMenuButton
                        className="hover:bg-[#2E4EC5]"
                        onClick={() => setOpenSide("juri")}
                      >
                        <icons.Star className="text-white" />
                        <span className="text-white font-bold">Juri</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <SidebarMenuItem key="users">
                      <SidebarMenuButton
                        className="hover:bg-[#2E4EC5]"
                        onClick={() => setOpenSide("users")}
                      >
                        <icons.User className="text-white" />
                        <span className="text-white font-bold">Users</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <SidebarMenuItem key="sertifikat">
                      <SidebarMenuButton
                        className="hover:bg-[#2E4EC5]"
                        onClick={() => setOpenSide("sertifikat")}
                      >
                        <icons.FolderClosed className="text-white" />
                        <span className="text-white font-bold">Sertifikat</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <SidebarMenuItem key="profile">
                      <SidebarMenuButton
                        className="hover:bg-[#2E4EC5]"
                        onClick={() => setOpenSide("profile")}
                      >
                        <icons.UserRound className="text-white" />
                        <span className="text-white font-bold">Profile</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
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

      {/* Bagian konten utama dengan animasi */}
      <motion.div
        className="flex-1 p-4"
        variants={contentVariants}
        key={openSide} // This ensures animation plays when content changes
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}

export default AdminSidebar;