"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const services = [
  {
    id: 1,
    title: "Rental Management",
    description: "Lorem Ipsum has been the industry's standard dummy",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Property Sales",
    description: "Lorem Ipsum has been the industry's standard dummy",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Maintenance & Repair",
    description: "Lorem Ipsum has been the industry's standard dummy",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Consultation",
    description: "Lorem Ipsum has been the industry's standard dummy",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function ServicesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-[#191919] mb-4">Our Services</h2>
          <p className="text-gray-600 text-lg">Lorem Ipsum has been the industry's standard dummy</p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

              {/* Service Info */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
