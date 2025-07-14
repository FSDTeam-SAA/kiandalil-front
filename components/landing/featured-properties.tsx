"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, fetchApprovedProperties } from "@/lib/api";
import type { Property } from "@/app/dashboard/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const categories = ["All", "Apartment", "Villa", "House"];

// API functions for wishlist
const fetchUserWishlist = async (token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/my-wishlist`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  const data = await response.json();
  // Return both wishlist item ID and property ID
  return data.data.map((item: any) => ({
    wishlistId: item._id,
    propertyId: item.propertyId._id,
  }));
};

const removeFromWishlist = async (wishlistId: string, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/remove/${wishlistId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove from wishlist");
  }

  return response.json();
};

export const PropertyCard = ({
  property,
  index,
  isWishlisted,
  wishlistId,
  onWishlistToggle,
}: {
  property: any;
  index: number;
  isWishlisted: boolean;
  wishlistId?: string;
  onWishlistToggle: (
    propertyId: string,
    isCurrentlyWishlisted: boolean,
    wishlistId?: string
  ) => void;
}) => {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const { data: session } = useSession();

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user?.accessToken) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      setIsToggling(true);

      if (isWishlisted) {
        if (!wishlistId) {
          throw new Error("Wishlist ID not found");
        }

        // Remove from wishlist
        const res = await removeFromWishlist(
          wishlistId,
          session?.user?.accessToken
        );
        if (res.success) {
          toast.success("Removed from wishlist");
          onWishlistToggle(property._id, true, wishlistId);
        }
      } else {
        // Add to wishlist
        const res = await addToWishlist(property._id);
        if (res.success) {
          toast.success(res.message);
          onWishlistToggle(property._id, false);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.div
      className="relative bg-white rounded-2xl overflow-hidden shadow-lg group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <a href={`/property/${property._id}`} className="block">
        {/* Property Image */}
        <div className="relative h-64">
          <Image
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Badges */}
          <div className="absolute top-4 left-4">
            <span className="bg-[#191919] text-white px-3 py-1 rounded-full text-sm font-medium">
              For Sale
            </span>
          </div>
          {/* Heart Icon */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            disabled={isToggling}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlisted
                  ? "text-red-500 fill-red-500"
                  : "text-white hover:text-red-500"
              }`}
            />
          </button>
          {/* Property Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white text-xl font-semibold mb-2">
              {property.title}
            </h3>
            <div className="flex items-center text-white/90 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {property.address}, {property.city}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-white/90 text-sm">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{property.quality.bed}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{property.quality.bath}</span>
                </div>
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  <span>{property.quality.sqrFt} sq ft</span>
                </div>
              </div>
              <div className="text-white font-bold text-lg">
                ${property?.price?.toLocaleString?.() || "—"}
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default function FeaturedProperties() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlistedProperties, setWishlistedProperties] = useState<
    Map<string, string>
  >(
    new Map() // Key: propertyId, Value: wishlistId
  );
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: allProperties } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchApprovedProperties,
    select: (data) => data?.data,
  });

  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => fetchUserWishlist(session?.user?.accessToken as string),
    enabled: !!session?.user?.accessToken,
    select: (data) => data,
  });

  // Update wishlisted properties when wishlist data changes
  useEffect(() => {
    if (wishlistData) {
      const newMap = new Map<string, string>();
      wishlistData.forEach((item: any) => {
        newMap.set(item.propertyId, item.wishlistId);
      });
      setWishlistedProperties(newMap);
    }
  }, [wishlistData]);

  const filteredProperties = allProperties?.filter((property: Property) => {
    if (selectedCategory === "All") return true;
    return property.type?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleWishlistToggle = (
    propertyId: string,
    wasWishlisted: boolean,
    wishlistId?: string
  ) => {
    setWishlistedProperties((prev) => {
      const newMap = new Map(prev);
      if (wasWishlisted) {
        newMap.delete(propertyId);
      } else {
        if (wishlistId) {
          newMap.set(propertyId, wishlistId);
        }
      }
      return newMap;
    });

    // Invalidate wishlist query to refetch
    queryClient.invalidateQueries({ queryKey: ["wishlist"] });
  };

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
          <h2 className="text-3xl md:text-4xl font-bold text-[#191919] mb-4">
            Featured Properties
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our handpicked selection of premium properties
          </p>
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "bg-[#191919] hover:bg-[#2a2a2a] text-white"
                    : ""
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProperties?.length > 0 ? (
            filteredProperties.map((property: Property, index: number) => (
              <PropertyCard
                key={property._id}
                property={property}
                index={index}
                isWishlisted={wishlistedProperties.has(property._id)}
                wishlistId={wishlistedProperties.get(property._id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              No properties found for this category.
            </p>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/all-listings">
            <Button className="bg-[#191919] hover:bg-[#2a2a2a] text-white px-8 py-3 rounded-full">
              View All Properties
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
