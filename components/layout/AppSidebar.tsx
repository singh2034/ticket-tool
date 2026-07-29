"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { LayoutDashboard, Ticket, Users, Settings, LogOut } from "lucide-react";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AppSidebar() {
  const { data: session } = useSession();

  const role = session?.user?.role;

  const items = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Tickets", url: "/tickets", icon: Ticket },

    ...(role === "ADMIN"
      ? [{ title: "Users", url: "/users", icon: Users }]
      : []),

    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem key="logout">
                <SidebarMenuButton
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
