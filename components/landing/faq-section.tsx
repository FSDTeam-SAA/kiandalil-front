"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqs = [
  {
    id: 1,
    question: "What happens to my security deposit?",
    answer:
      "Your security deposit is held in a secure escrow account and will be returned within 30 days of lease termination, minus any deductions for damages beyond normal wear and tear.",
  },
  {
    id: 2,
    question: "Are pets allowed in your properties?",
    answer:
      "Pet policies vary by property. Many of our properties are pet-friendly with additional pet deposits and monthly fees. Please check individual property listings for specific pet policies.",
  },
  {
    id: 3,
    question: "How long is the lease term?",
    answer:
      "We offer flexible lease terms ranging from 6 months to 2 years, depending on the property and your needs. Short-term furnished rentals are also available for select properties.",
  },
  {
    id: 4,
    question: "What is included in the rent?",
    answer:
      "Rent typically includes basic utilities like water and trash. Some properties may include additional utilities, internet, or amenities. Check individual property listings for specific inclusions.",
  },
  {
    id: 5,
    question: "Is your company licensed and insured?",
    answer:
      "Yes, we are fully licensed real estate professionals and carry comprehensive insurance coverage. All our agents are licensed and regularly undergo continuing education.",
  },
]

export default function FAQSection() {
  return (
    <section className="py-20 px-6 bg-white" id="faq">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#191919] mb-4">Frequently Ask Question (FAQs)</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services and properties
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-[#191919] hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
