"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use } from "react";

const cities = [
  {
    id: 1,
    name: "New York",
    properties: 8,
    image: "/placeholder.svg?height=300&width=400",
    className: "bg-gradient-to-br from-red-500/20 to-purple-600/20",
  },
  {
    id: 2,
    name: "New York",
    properties: 8,
    image: "/placeholder.svg?height=300&width=400",
    className: "bg-gradient-to-br from-blue-500/20 to-cyan-600/20",
  },
  {
    id: 3,
    name: "New York",
    properties: 8,
    image: "/placeholder.svg?height=300&width=400",
    className: "bg-gradient-to-br from-gray-500/20 to-gray-700/20",
  },
  {
    id: 4,
    name: "New York",
    properties: 8,
    image: "/placeholder.svg?height=300&width=400",
    className: "bg-gradient-to-br from-orange-500/20 to-red-600/20",
  },
  {
    id: 5,
    name: "New York",
    properties: 8,
    image: "/placeholder.svg?height=300&width=400",
    className: "bg-gradient-to-br from-gray-600/20 to-gray-800/20",
  },
];

export default function CitiesSection() {
  const session = useSession();
  console.log(session);
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-[#191919] mb-4">
            Find Properties in these cities
          </h2>
          <p className="text-gray-600 text-lg">
            Lorem Ipsum has been the industry's standard dummy
          </p>
        </motion.div>

        {/* Cities Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {cities.map((city, index) => (
            <motion.div
              key={city.id}
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`absolute inset-0 ${city.className}`} />
              <Image
                src={city.image || "/placeholder.svg"}
                alt={city.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

              {/* City Info */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold mb-1">{city.name}</h3>
                <p className="text-sm opacity-90">
                  {city.properties} Properties
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
