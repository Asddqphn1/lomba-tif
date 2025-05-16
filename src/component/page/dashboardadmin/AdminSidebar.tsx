import {
  Sidebar, // Ubah nama impor untuk menghindari konflik
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
import { UsersSection } from "./UsersSection";

const items = [
  {
    title: "Dashboard",
    url: "#",
    icons: icons.House,
  },
  {
    title: "Daftar Lomba",
    url: "#",
    icons: icons.Trophy,
  },
  {
    title: "Peserta",
    url: "daftarpeserta",
    icons: icons.User,
  },
  {
    title: "Juri",
    url: "#",
    icons: icons.Star,
  },
  {
    title: "Settings",
    url: "#",
    icons: icons.Settings,
  },
];

function AdminSidebar() {
  const [open, setOpen] = useState(true);

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
                Admin Lomba{" "}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="mt-8">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="hover:bg-[#2E4EC5]">
                        <a href={item.url}>
                          <item.icons className="text-white" />
                          <span className="text-white font-bold">
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
      <UsersSection/>     
          
      {/* <PesertaSection /> */}
    </div>
  );
}

export default AdminSidebar;
