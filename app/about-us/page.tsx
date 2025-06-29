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
            We specialize in connecting clients with premium residential and
            investment properties. With a focus on trust, transparency, and
            market expertise, we offer personalized real estate solutions to
            help you find the perfect home or grow your portfolio.
          </p>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#191919] mb-6">
              About Your Website
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
              euismod velit. Ut dapibus est urna. Suspendisse dictum facilisis
              ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
              Morbi condimentum porttitor turpis sed ultrices. Suspendisse
              auctor faucibus magna, imperdiet maximus orci ultricies a. Cras
              placerat elit a sagittis tristique. Etiam imperdiet pulvinar nisl
              in pellentesque. Sed ante orci, egestas id quam nec, eleifend
              varius magna. Fusce massa nisl, dignissim ut cursus et.
            </p>

            <h3 className="text-3xl font-bold text-[#191919] mb-6">
              Our Mission
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
              euismod velit. Ut dapibus est urna. Suspendisse dictum facilisis
              ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
              Morbi condimentum porttitor turpis sed ultrices. Suspendisse
              auctor faucibus magna, imperdiet maximus orci ultricies a. Cras
              placerat elit a sagittis tristique. Etiam imperdiet pulvinar nisl
              in pellentesque. Sed ante orci, egestas id quam nec, eleifend
              varius magna. Fusce massa nisl.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-3xl font-bold text-[#191919] mb-2">30K+</h4>
                <p className="text-gray-600">Our Users</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-[#191919] mb-2">12K+</h4>
                <p className="text-gray-600">Satisfied Brand</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-[#191919] mb-2">2K+</h4>
                <p className="text-gray-600">Company List</p>
              </div>
            </div>
          </motion.div>

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
                className="w-[516px] h-[570px] rounded-lg object-cover"
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
            euismod velit. Ut dapibus est urna. Suspendisse dictum facilisis
            ullamcorper.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-[#191919] rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <p className="text-gray-600">
                Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed eget euismod velit. Ut dapibus est urna. Suspendisse
                dictum facilisis ullamcorper. Maecenas vitae efficitur tortor,
                in placerat dui.
              </p>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-[#191919] rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <p className="text-gray-600">
                Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed eget euismod velit. Ut dapibus est urna. Suspendisse
                dictum facilibus ullamcorper. Maecenas vitae efficitur tortor,
                in placerat dui.
              </p>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
            euismod velit. Ut dapibus est urna. Suspendisse dictum facilibus
            ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
            euismod velit. Ut dapibus est urna. Suspendisse dictum facilibus
            ullamcorper.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-[#191919] rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <p className="text-gray-600">
                Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed eget euismod velit. Ut dapibus est urna. Suspendisse
                dictum facilibus ullamcorper. Maecenas vitae efficitur tortor,
                in placerat dui.
              </p>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
            euismod velit. Ut dapibus est urna. Suspendisse dictum facilibus
            ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
            euismod velit. Ut dapibus est urna. Suspendisse dictum facilibus
            ullamcorper. Maecenas vitae efficitur tortor, in placerat dui. Morbi
            condimentum porttitor turpis sed ultrices. Suspendisse auctor
            faucibus magna, imperdiet maximus orci ultricies a. Cras placerat
            elit a sagittis tristique. Etiam imperdiet pulvinar nisl in
            pellentesque. Sed ante orci, egestas id quam nec, eleifend varius
            magna. Fusce massa nisl, dignissim ut cursus et.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
            euismod velit. Ut dapibus est urna. Suspendisse dictum facilibus
            ullamcorper. Maecenas vitae efficitur tortor, in placerat dui. Morbi
            condimentum porttitor turpis sed ultrices.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Suspendisse auctor faucibus magna, imperdiet maximus orci ultricies
            a. Cras placerat elit a sagittis tristique. Etiam imperdiet pulvinar
            nisl in pellentesque. Sed ante orci, egestas id quam nec, eleifend
            varius magna. Fusce massa nisl, dignissim ut cursus et.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
