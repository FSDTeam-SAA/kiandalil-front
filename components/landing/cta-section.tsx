"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CTASection() {

  const { status } = useSession()

  return (
    <section className="relative py-20 px-6 ">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat h-[537px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/CARBG.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto flex flex-col pt-[150px]   h-[537px] text-white">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-6 "
        >
          Unlock Exclusive Property Access
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl mb-8 text-gray-200 w-[875px] "
        >
          Join our premium community to receive priority listings, personalized
          agent matching, and VIP open house invitations. Maximize your search
          with insider advantages.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {
            status === "authenticated" ? (
              <Link href="/your-posts" className="w-full">
                <Button className="">Get Started</Button>
              </Link>
            ) : (
              <Link href="/auth/register" className="w-full">
                <Button className="">Get Started</Button>
              </Link>
            )
          }
        </motion.div>
      </div>
    </section>
  );
}
