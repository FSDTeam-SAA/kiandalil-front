"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "Rental Management",
    description: "Lorem Ipsum has been the industry's standard dummy",
    image: "/slide1.jpg",
  },
  {
    id: 2,
    title: "Buying & Selling",
    description: "Professional real estate buying and selling services",
    image: "/slide2.jpg",
  },
  {
    id: 3,
    title: "Maintenance & Repair",
    description: "Complete property maintenance and repair solutions",
    image: "/slide3.jpg",
  },
  {
    id: 4,
    title: "Construction",
    description: "Full-scale construction and renovation services",
    image: "/slide4.jpg",
  },
];

export function ServicesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + services.length) % services.length
    );
  };

  // Create infinite loop by duplicating services
  const getInfiniteServices = () => {
    return [...services, ...services, ...services];
  };

  const infiniteServices = getInfiniteServices();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Our Services</h2>
        <p className="text-muted-foreground text-lg">
          Here are some of the key services we offer to meet your needs.
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>

        {/* Slides Container */}
        <div className="overflow-hidden px-16">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{
              transform: `translateX(-${
                (currentIndex + services.length) * 306
              }px)`, // 280px + 24px gap + 2px adjustment
            }}
          >
            {infiniteServices.map((service, index) => {
              const actualIndex = index % services.length;
              const isActive =
                actualIndex === currentIndex &&
                index >= services.length &&
                index < services.length * 2;

              return (
                <Card
                  key={`${service.id}-${index}`}
                  className={cn(
                    "relative overflow-hidden flex-shrink-0 transition-all duration-500 border-0",
                    isActive ? "w-[380px]" : "w-[280px]"
                  )}
                  style={{ height: "320px" }}
                >
                  <CardContent className="p-0 h-full relative">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${service.image})`,
                        backgroundColor:
                          actualIndex % 4 === 0
                            ? "#f3f4f6"
                            : actualIndex % 4 === 1
                            ? "#374151"
                            : actualIndex % 4 === 2
                            ? "#d1d5db"
                            : "#6b7280",
                      }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                      <h3
                        className={cn(
                          "font-bold mb-2",
                          isActive ? "text-2xl" : "text-xl"
                        )}
                      >
                        {service.title}
                      </h3>
                      <p className="text-sm opacity-90 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {services.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                "w-2 h-2 rounded-full p-0 transition-colors duration-200",
                index === currentIndex ? "bg-primary" : "bg-muted"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
