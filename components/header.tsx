"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle, User, ShoppingBag, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";

const navigationItems = [
  { name: "Listings", href: "/all-listings" },
  { name: "Wishlist", href: "#" },
  { name: "Contact", href: "/contact-us" },
  { name: "About Us", href: "/about-us" },
  { name: "Your properties", href: "/your-posts" },
  { name: "News", href: "/news" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  // Determine if the user is logged in
  const isLoggedIn = status === "authenticated" && !!session?.user;

  // Get user role from session
  const userRole = session?.user?.role || "user";

  // Function to get profile link based on user role
  const getProfileLink = () => {
    if (userRole === "admin" || userRole === "seller") {
      return "/dashboard"; // Adjust as per your routing
    }
    return "/profile"; // Adjust as per your routing
  };

  // Function to get order history link for users
  const getOrderHistoryLink = () => {
    return "/order-history"; // Adjust as per your routing
  };

  // Handle logout
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to home after logout
  };

  return (
    <header className="bg-[#191919] text-white py-2 px-6 relative z-50">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-xl text-center font-bold">
          Hidden
          <br />
          Props
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons/Profile Icon */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer">
                  <UserCircle className="h-8 w-8 text-[#039B06]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href={getProfileLink()}
                    className="w-full cursor-pointer hover:text-[#039B06]"
                  >
                    <User className="mr-2 h-4 w-4 text-[#039B06]" />
                    {userRole === "admin" || userRole === "seller"
                      ? "Dashboard"
                      : "Profile"}
                  </Link>
                </DropdownMenuItem>
                {userRole === "user" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={getOrderHistoryLink()}
                      className="w-full cursor-pointer hover:text-[#039B06]"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4 text-[#039B06]" />
                      Your Post
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-50 focus:text-red-500 hover:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-600" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/sign-in">
              </Link>
              <Link href="/register">
                <Button
                  variant="default"
                  className="bg-[#014A14] hover:bg-[#039B06] text-white cursor-pointer"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-full left-0 right-0 bg-[#191919] border-t border-gray-700 py-4"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-6 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </motion.nav>
      )}
    </header>
  );
}