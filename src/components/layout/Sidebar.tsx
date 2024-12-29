import { FileEdit, Settings, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Create Post",
    icon: FileEdit,
    path: "/posts/new",
  },
  {
    title: "Manage Posts",
    icon: List,
    path: "/posts",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      <SidebarContainer>
        <div className="flex items-center h-16 px-4 border-b">
          <h1 className="text-xl font-semibold tracking-tight">SCRIBBLR</h1>
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton onClick={() => navigate(item.path)}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarContainer>
      <SidebarTrigger />
    </>
  );
}