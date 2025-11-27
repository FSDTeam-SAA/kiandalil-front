"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Mail, Phone } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="py-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-[#191919] mb-6">About Us</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            We specialize in providing access to off-market and under-market
            real estate opportunities. Built for investors, brokers, owners, and
            wholesalers, Hidden Prop delivers fast, transparent deal flow and
            direct connections to real undervalued properties.
          </p>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#191919] mb-6">
              About Hidden Prop
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Hidden Prop is a free platform where users can post and access
              off-market and under-market real estate opportunities. The site is
              built for investors, brokers, owners, and wholesalers who want
              clean deal flow without paywalls, noise, or retail-priced
              listings. Every post includes direct contact information so
              interested parties can move quickly, evaluate opportunities, and
              connect with one another on their own terms. Our goal is to make
              discovering undervalued properties simple, fast, and transparent.
            </p>

            <h3 className="text-3xl font-bold text-[#191919] mb-6">
              Our Mission
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our mission is to create the most efficient space for genuine
              real-estate deals to surface. Hidden Prop exists to help serious
              players find opportunities early, share under-market properties
              openly, and connect directly without middlemen. We aim to improve
              transparency in the investment landscape by giving
              everyone-regardless of size or experience-free access to real
              undervalued deals and the people behind them.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative place-items-end"
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
        </div>

        {/* What We Offer */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-[#191919] mb-8">
            What We Offer
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Hidden Prop gives users a simple, free way to share and discover
            real estate opportunities that are off-market, under-market, or
            overlooked. The platform is built to deliver fast, transparent deal
            flow without the noise of banners of traditional listing sites.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-[#191919] rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <p className="text-gray-600">
                Free Deal Posting: Anyone-investors, brokers, owners, or
                wholesalers-can post opportunities they control or find, at no
                cost.
              </p>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-[#191919] rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <p className="text-gray-600">
                Undervalued Opportunities: The platform highlights deals priced
                below market, including distressed, underperforming, or
                underexposed assets.
              </p>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-[#191919] rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <p className="text-gray-600">
                Direct Contact: Each listing includes clear contact information
                so interested buyers can connect immediately and move quickly.
              </p>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Hidden Prop is designed to make real estate deal flow more open,
            efficient, and accessible for serious players looking for genuine
            opportunities.
          </p>
        </motion.section>

        {/* Unique Business Content */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-[#191919] mb-8">
            Unique Business content
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Hidden Prop focuses exclusively on real, actionable real estate
            opportunities that investors actually care about. Every listing must
            offer value-off-market positioning, under-market pricing, distress,
            or inefficiency-so users spend less time sifting through noise.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-[#191919] rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <p className="text-gray-600">
                Value-Driven Listings: Deals posted on Hidden Prop are chosen
                for their pricing advantage, potential upside, or overlooked
                status.
              </p>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Our content stays centered on genuine opportunities, helping serious
            users find deals that stand out from traditional listing platforms.
          </p>
        </motion.section>

        {/* Our Commitment */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-[#191919] mb-8">
            Our Commitment
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We are committed to making real estate deal flow open, efficient,
            and fair for everyone. Hidden Prop removes the barriers, paywalls,
            and gatekeeping that typically slow down the investment process. Our
            platform provides transparent access to under-market deals while
            allowing users to connect directly with no middlemen.
          </p>
          <p className="text-gray-600 leading-relaxed pt-5">
            We aim to elevate the quality of information in the investment
            community by giving every user the ability to share opportunities,
            evaluate value, and participate in a more honest and transparent
            marketplace.
          </p>
        </motion.section>

        {/* Join Us */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-[#191919] mb-8">Join Us</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Hidden Prop is building a community of serious investors, brokers,
            owners, and wholesalers who want direct access to genuine
            undervalued properties. By joining, you connect with others who
            prioritize speed, transparency, and real opportunity over hype.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you're posting your first deal or searching for your next
            investment, Hidden Prop gives you a simple, free, and effective way
            to participate in a real estate marketplace built around value-not
            noise.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
