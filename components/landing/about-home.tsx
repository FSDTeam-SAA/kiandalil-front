"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Mail, Phone } from "lucide-react";

export default function AboutUsHome() {
  return (
    <section className="lg:pt-20 pt-4 bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Content */}
          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className=" overflow-hidden">
              <Image
                src="/about.jpg"
                alt="Modern apartment building"
                width={1000}
                height={1000}
                className="w-full h-[570px] rounded-lg object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#191919] mb-6">
              About Our Website
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Hidden Prop is a marketplace built for real estate investors,
              wholesalers, and agents who work with true investment-grade
              opportunities. We focus exclusively on off-market, under-market,
              distressed, and wholesale deals - plus MLS listings priced well
              below market value. Our platform makes it easy to post a deal,
              find a deal, and connect directly with motivated buyers and
              sellers.
            </p>

            <h3 className="text-3xl font-bold text-[#191919] mb-6">
              Our Mission
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our mission is to create the most reliable and transparent
              marketplace for investor-focused real estate. We want to
              centralize the deals that matter - value-add, discounted,
              off-market, and assignment opportunities - and give investors a
              simple way to identify and close strong deals. Hidden Prop is
              built to eliminate noise, remove retail clutter, and highlight
              properties that offer real financial upside.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
