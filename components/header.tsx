"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signIn, signOut } from "next-auth/react";

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
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <UserCircle className="h-8 w-8" size={24}/>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#191919] text-white border-gray-700">
                {session?.user?.name && (
                  <DropdownMenuItem className="opacity-100 cursor-default">
                    <span className="font-bold">{session.user.name}</span>
                  </DropdownMenuItem>
                )}
                {session?.user?.email && (
                  <DropdownMenuItem className="opacity-100 cursor-default">
                    <span className="text-gray-400 text-sm">
                      {session.user.email}
                    </span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Button
                    onClick={() => signOut()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-1"
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => signIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Login
            </Button>
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
