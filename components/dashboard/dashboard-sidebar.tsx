"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Users,
    Home,
    Verified,
    Newspaper,
    PaperclipIcon,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import Image from "next/image";

const menuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Properties Listing",
        url: "/dashboard/properties-listing",
        icon: Home,
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
    },
    {
        title: "Approve Page",
        url: "/dashboard/approve-page",
        icon: Verified,
    },
    {
        title: "News",
        url: "/dashboard/news",
        icon: Newspaper,
    },
    {
        title: "Newsletter",
        url: "/dashboard/newsletter",
        icon: PaperclipIcon,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

export function DashboardSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <>
            <Sidebar className="border-r-0 w-[108px] top-0 fixed z-50" collapsible="none" {...props}>
                <SidebarContent className="p-4 bg-[#131313]">
                    <Link href={"/dashboard"} className="text-white">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={200}
                            height={200}
                            className="mx-auto h-[80px] w-[80px] object-contain mb-4"
                        />
                    </Link>
                    <SidebarMenu className="space-y-5">
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    isActive={isActive(item.url)}
                                    className="group py-8 flex justify-center hover:bg-[#ffffff] data-[active=true]:bg-[#ffffff]"
                                >
                                    <Link href={item.url} className="flex flex-col items-center">
                                        <item.icon
                                            className={`h-5 w-5 ${isActive(item.url)
                                                ? "text-[#212121]"
                                                : "text-[#ffffff] group-hover:text-[#212121]"
                                                }`}
                                        />
                                        <span
                                            className={`text-[12px] font-medium text-center ${isActive(item.url)
                                                ? "text-[#212121]"
                                                : "text-[#ffffff] group-hover:text-[#212121]"
                                                }`}
                                        >
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>

                <div className="mt-auto p-4 bg-[#212121] border-t border-[#5c5343]">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => setIsLogoutDialogOpen(true)}
                                className="group py-8 flex justify-center hover:bg-[#ffffff]"
                            >
                                <div className="flex flex-col items-center">
                                    <LogOut className="h-5 w-5 text-[#ffffff] group-hover:text-[#212121]" />
                                    <span className="text-[12px] font-medium text-[#ffffff] group-hover:text-[#212121]">
                                        Logout
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </Sidebar>

            {/* LogOutModal component would go here */}
            {isLogoutDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to logout?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsLogoutDialogOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsLogoutDialogOpen(false);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}