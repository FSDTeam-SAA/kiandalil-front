"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface Testimonial {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  comment: string
  rate: number
  createdAt: string
  updatedAt: string
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        if (result.success && Array.isArray(result.data)) {
          setTestimonials(result.data)
        } else {
          setError("Invalid API response format.")
        }
      } catch (e: any) {
        setError(e.message || "Failed to fetch testimonials.")
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-6 bg-white text-center">
        <p className="text-gray-600">Loading testimonials...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 px-6 bg-white text-center">
        <p className="text-red-500">Error: {error}</p>
      </section>
    )
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#191919] mb-4">What Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied clients about their experience with us
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial._id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-6 rounded-lg h-full flex flex-col justify-between" // Added h-full and flex properties for consistent card height
                >
                  <div>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rate)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                      {[...Array(5 - testimonial.rate)].map((_, i) => (
                        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 rounded-full mr-4">
                      <AvatarImage src="/placeholder.svg?height=60&width=60" alt={testimonial.userId.name} />
                      <AvatarFallback>{testimonial.userId.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-[#191919]">{testimonial.userId.name}</h4>
                      {/* Role is not available in API, so it's omitted */}
                      {/* <p className="text-sm text-gray-600">{testimonial.role}</p> */}
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
         
        </Carousel>
      </div>
    </section>
  )
}
