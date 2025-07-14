"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "John D.",
      role: "Property Owner",
      comment:
        "Found my dream apartment in just 3 days! The virtual tour saved me hours, and the agent handled all the paperwork. Truly stress-free!",
      image: "/avatar.jpg",
    },
    {
      id: 2,
      name: "Anna M.",
      role: "Property Owner",
      comment:
        "The rental management team is incredibly responsive and proactive. My property has never been better maintained, and I have complete peace of mind. Highly recommend!",
      image: "/avatar.jpg",
    },
    {
      id: 3,
      name: "Leah H.",
      role: "Property Owner",
      comment:
        "Selling my house was daunting, but they made it so easy. From staging advice to handling negotiations, they were exceptional. Got a fantastic price too!",
      image: "/avatar.jpg",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#191919] mb-2">
            What Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied clients about their experiences with our
            services
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white border rounded-xl shadow-sm p-6 relative flex flex-col justify-between"
            >
              {/* Comment */}
              <p className="text-gray-800 text-sm mb-6 leading-relaxed">
                {testimonial.comment}
              </p>

              {/* Quote Icon */}
              <Quote
                className="absolute bottom-6 right-6 text-purple-100 w-10 h-10"
                strokeWidth={2}
              />

              {/* Author */}
              <div className="flex items-center mt-auto pt-6">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#191919]">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
