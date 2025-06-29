"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#191919] mb-4">
            Write your thoughts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with us and share your real estate needs or feedback
          </p>
        </motion.div>

        <div className="grid grid-cols-5 gap-12  ">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-5 md:col-span-3"
          >
            <img
              src="/thoughrt.jpg"
              alt="Modern interior"
              className="w-full h-auto md:h-[300px] object-center rounded-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 col-span-5 md:col-span-2 "
          >
            <Input placeholder="First Name" />
            <Input placeholder="Email Address" type="email" />
            <Textarea placeholder="Your Message" rows={4} />
            <Button className="w-full bg-[#191919] hover:bg-[#2a2a2a] text-white py-3">
              Send Message
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
