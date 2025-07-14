"use client";

import type React from "react";
import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Phone,
  MessageCircle,
  ChevronLeft,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Property {
  _id: string;
  title: string;
  subtitle: string;
  type: string;
  description: string;
  images: string[];
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  features: string[];
  quality: {
    propertyType: string;
    houseType: string;
    bed: string;
    bath: string;
    sqrFt: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  price?: number;
  offMarket: boolean;
  whatsappNum?: number | null;
  phoneNum?: string | null;
  createdAt: string;
}

interface WishlistItem {
  _id: string;
  propertyId: {
    _id: string;
    [key: string]: any;
  };
}

interface Filters {
  search: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  bed: string;
  country: string;
  city: string;
  sortBy: string;
  offMarket: boolean;
}

function AllListingsContent() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // State management
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [cities, setCities] = useState<string[]>([]);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "All Types",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bed: searchParams.get("bed") || "Any",
    country: searchParams.get("country") || "",
    city: searchParams.get("city") || "",
    sortBy: searchParams.get("sortBy") || "Most Recent",
    offMarket: searchParams.get("offMarket") === "true",
  });

  // API functions
  const fetchWishlist = async (): Promise<{ data: WishlistItem[] }> => {
    if (!token) throw new Error("No token available");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-wishlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch wishlist");
    return response.json();
  };

  const addToWishlist = async (propertyId: string) => {
    if (!token) throw new Error("Please login to add to wishlist");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/add-wishlist`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId }),
      }
    );
    if (!response.ok) throw new Error("Failed to add to wishlist");
    return response.json();
  };

  const removeFromWishlist = async (wishlistId: string) => {
    if (!token) throw new Error("Please login to manage wishlist");
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
    if (!response.ok) throw new Error("Failed to remove from wishlist");
    return response.json();
  };

  // Fetch wishlist using TanStack Query
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // Memoized wishlist lookup for better performance
  const wishlistMap = useMemo(() => {
    const map = new Map();
    wishlistData?.data?.forEach((item: WishlistItem) => {
      map.set(item.propertyId?._id, item._id);
    });
    return map;
  }, [wishlistData]);

  // Wishlist mutations with optimistic updates
  const { mutate: addToWishlistMutation } = useMutation({
    mutationFn: addToWishlist,
    onMutate: async (propertyId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      queryClient.setQueryData(["wishlist"], (old: any) => ({
        ...old,
        data: [
          ...(old?.data || []),
          { _id: `${propertyId}`, propertyId: { _id: propertyId } },
        ],
      }));

      return { previousWishlist };
    },
    onError: (err, propertyId, context) => {
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      toast.error("Failed to add to wishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Added to wishlist");
    },
  });

  const { mutate: removeFromWishlistMutation } = useMutation({
    mutationFn: removeFromWishlist,
    onMutate: async (wishlistId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      queryClient.setQueryData(["wishlist"], (old: any) => ({
        ...old,
        data:
          old?.data?.filter((item: WishlistItem) => item._id !== wishlistId) ||
          [],
      }));

      return { previousWishlist };
    },
    onError: (err, wishlistId, context) => {
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      toast.error("Failed to remove from wishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
  });

  // Contact functions
  const handlePhoneCall = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.phoneNum) {
      window.location.href = `tel:${property.phoneNum}`;
    } else {
      toast.error("Phone number not available for this property");
    }
  };

  const handleWhatsApp = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.whatsappNum) {
      const message = encodeURIComponent(
        `Hi ${property?.userId?.name}, I'm interested in the property: ${
          property.title
        } - $${property?.price?.toLocaleString()}. Can you provide more details?`
      );
      const whatsappUrl = `https://wa.me/${property?.whatsappNum}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    } else {
      toast.error("WhatsApp number not available for this property");
    }
  };

  // Fetch cities
  const fetchCities = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/all/properties/citys`
      );
      const data = await response.json();
      if (data.success) {
        setCities(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  }, []);

  // Update URL parameters
  const updateURL = useCallback((newFilters: Filters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.type !== "All Types") params.set("type", newFilters.type);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.bed !== "Any") params.set("bed", newFilters.bed);
    if (newFilters.country) params.set("country", newFilters.country);
    if (newFilters.city) params.set("city", newFilters.city);
    if (newFilters.sortBy !== "Most Recent")
      params.set("sortBy", newFilters.sortBy);
    if (newFilters.offMarket) params.set("offMarket", "true");

    const newUrl = `/all-listings${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    window.history.pushState(null, "", newUrl);
  }, []);

  // Fetch properties
  const fetchProperties = useCallback(
    async (filtersToUse = filters, page = currentPage) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filtersToUse.search) params.set("search", filtersToUse.search);
        if (filtersToUse.type !== "All Types")
          params.set("type", filtersToUse.type);
        if (filtersToUse.minPrice)
          params.set("minPrice", filtersToUse.minPrice);
        if (filtersToUse.maxPrice)
          params.set("maxPrice", filtersToUse.maxPrice);
        if (filtersToUse.bed !== "Any") params.set("bed", filtersToUse.bed);
        if (filtersToUse.country) params.set("country", filtersToUse.country);
        if (filtersToUse.city) params.set("city", filtersToUse.city);
        if (filtersToUse.offMarket) params.set("offMarket", "true");
        params.set("page", page.toString());

        // Add sorting
        if (filtersToUse.sortBy === "Price Low to High") {
          params.set("sort", "price");
          params.set("order", "asc");
        } else if (filtersToUse.sortBy === "Price High to Low") {
          params.set("sort", "price");
          params.set("order", "desc");
        } else if (filtersToUse.sortBy === "Most Popular") {
          params.set("sort", "views");
          params.set("order", "desc");
        }

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/properties/approved/all?${params.toString()}`
        );

        const data = await response.json();
        if (data.success) {
          setProperties(data.data);
          setTotalResults(data.total || data.data.length);
        }
      } catch (error) {
        toast.error("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    },
    [filters, currentPage]
  );

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const debouncedSearch = useCallback(
    (newFilters: Filters) => {
      if (searchTimeout) clearTimeout(searchTimeout);

      const timeout = setTimeout(() => {
        fetchProperties(newFilters, 1);
        setCurrentPage(1);
      }, 500);

      setSearchTimeout(timeout);
    },
    [fetchProperties, searchTimeout]
  );

  // Handle filter changes
  const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);

    if (key === "search") {
      debouncedSearch(newFilters);
    } else {
      fetchProperties(newFilters, 1);
      setCurrentPage(1);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please login to manage wishlist");
      return;
    }

    const wishlistId = wishlistMap.get(propertyId);
    if (wishlistId) {
      removeFromWishlistMutation(wishlistId);
    } else {
      addToWishlistMutation(propertyId);
    }
  };

  // Initial load
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchProperties(filters, currentPage), fetchCities()]);
    };

    initializeData();
  }, []); // Only run once on mount

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  const PropertyCard = ({
    property,
    index,
  }: {
    property: Property;
    index: number;
  }) => {
    const isInWishlist = wishlistMap.has(property._id);
    const { data: session } = useSession();

    // Determine image layout based on number of images
    const getImageLayout = () => {
      const imageCount = property.images.length;

      if (imageCount === 0) {
        return (
          <div className="relative h-full w-full">
            <Image
              src="/placeholder.svg?height=400&width=300"
              alt="No images available"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        );
      }

      if (imageCount === 1) {
        return (
          <div className="relative h-full w-full">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        );
      }

      if (imageCount === 2) {
        return (
          <div className="grid grid-cols-2 gap-1 h-full">
            <div className="relative">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              />
            </div>
            <div className="relative">
              <Image
                src={property.images[1]}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              />
            </div>
          </div>
        );
      }

      // Default layout for 3+ images
      return (
        <div className="grid grid-cols-2 gap-1 h-[280px]">
          {/* Main large image */}
          <div className="relative row-span-2">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
            />
          </div>

          {/* Two smaller images */}
          <div className="grid grid-rows-2 gap-1 h-[280px]">
            <div className="relative">
              <Image
                src={property.images[1]}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 8vw"
              />
            </div>
            <div className="relative">
              <Image
                src={property.images[2]}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 8vw"
              />
            </div>
          </div>
        </div>
      );
    };

    return (
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 md:h-[280px]"
        whileHover={{ y: -1, transition: { duration: 0.2 } }}
        layout={false}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
          {/* Property Images - Clickable for details */}
          <div
            className="relative h-64 lg:h-full min-h-[280px] cursor-pointer"
            onClick={() => router.push(`/property/${property._id}`)}
          >
            {property.offMarket && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium z-20">
                Off Market
              </div>
            )}
            <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium z-10">
              {property.images.length} photos
            </div>

            {getImageLayout()}
          </div>

          {/* Property Details - Clickable for details */}
          <div
            className="lg:col-span-2 p-4 lg:p-6 flex flex-col justify-between min-h-[280px] cursor-pointer"
            onClick={() => router.push(`/property/${property._id}`)}
          >
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-[#191919] mb-2">
                    ${property.price?.toLocaleString() || "N/A"}
                  </h3>
                  <h4 className="text-base lg:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {property.title}
                  </h4>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="text-sm truncate">
                      {property.city && `${property.city}, `}
                      {property.address}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 ml-2 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(property._id, e);
                  }}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isInWishlist
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                  />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-6">
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                  {property.type}
                </span>
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.quality.bed} bed</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.quality.bath} bath</span>
                </div>
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {property.quality.sqrFt} sq ft
                  </span>
                </div>
              </div>
            </div>

            {/* Agent Contact - Non-clickable section */}
            <div
              className="border-t pt-4 mt-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {property.userId.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800 truncate">
                      {property.userId.name}
                    </div>
                    {/* <div className="text-xs text-gray-500">Agent</div> */}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!session?.user) {
                        toast.error("Please login to view contact details");
                        return;
                      }
                      if (!property.phoneNum) {
                        toast.error("Phone number not available");
                        return;
                      }
                      handlePhoneCall(property, e);
                    }}
                    title={
                      !session?.user
                        ? "Login to view contact details"
                        : property.phoneNum
                        ? `Call ${property.phoneNum}`
                        : "Phone number not available"
                    }
                  >
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline">Call</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!session?.user) {
                        toast.error("Please login to view contact details");
                        return;
                      }
                      if (!property.whatsappNum) {
                        toast.error("WhatsApp number not available");
                        return;
                      }
                      handleWhatsApp(property, e);
                    }}
                    title={
                      !session?.user
                        ? "Login to view contact details"
                        : property.whatsappNum
                        ? `WhatsApp ${property.whatsappNum}`
                        : "WhatsApp number not available"
                    }
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Chat</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex space-x-4">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <span>/</span>
            <span>Home</span>
            <span>/</span>
            <span className="text-[#191919] font-medium">Properties</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 items-end">
            <div className="xl:col-span-2">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Search Properties
              </Label>
              <Input
                placeholder="Search by title, location..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </Label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </Label>
              <Select
                value={filters.city}
                onValueChange={(value) =>
                  handleFilterChange("city", value === "allCities" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allCities">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </Label>
              <Input
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                type="number"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </Label>
              <Input
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                type="number"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </Label>
              <Select
                value={filters.bed}
                onValueChange={(value) => handleFilterChange("bed", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Most Recent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Most Recent">Most Recent</SelectItem>
                  <SelectItem value="Price Low to High">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="Price High to Low">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="Most Popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {/* Additional filters row */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="off-market"
                checked={filters.offMarket}
                onCheckedChange={(checked) =>
                  handleFilterChange("offMarket", checked)
                }
              />
              <Label htmlFor="off-market" className="text-sm font-medium">
                Show Off-Market Properties
              </Label>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const resetFilters: Filters = {
                    search: "",
                    type: "All Types",
                    minPrice: "",
                    maxPrice: "",
                    bed: "Any",
                    country: "",
                    city: "",
                    sortBy: "Most Recent",
                    offMarket: false,
                  };
                  setFilters(resetFilters);
                  updateURL(resetFilters);
                  fetchProperties(resetFilters, 1);
                  setCurrentPage(1);
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-600">Properties For Sale</span>
            <span className="font-semibold text-[#191919]">
              {totalResults.toLocaleString()} results
            </span>
            {filters.city && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                in{" "}
                {cities.find(
                  (city) =>
                    city.toLowerCase().replace(/\s+/g, "-") === filters.city
                ) || filters.city}
              </span>
            )}
            {filters.offMarket && (
              <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                Off-Market Only
              </span>
            )}
          </div>
        </div>

        {/* Properties Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : properties.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 text-lg mb-4">
                No properties found
              </div>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters to see more results
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  const resetFilters: Filters = {
                    search: "",
                    type: "All Types",
                    minPrice: "",
                    maxPrice: "",
                    bed: "Any",
                    country: "",
                    city: "",
                    sortBy: "Most Recent",
                    offMarket: false,
                  };
                  setFilters(resetFilters);
                  updateURL(resetFilters);
                  fetchProperties(resetFilters, 1);
                  setCurrentPage(1);
                }}
              >
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="properties"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {properties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && properties.length > 0 && totalResults > 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-4"
          >
            <Button
              variant="outline"
              onClick={() => {
                const newPage = Math.max(1, currentPage - 1);
                setCurrentPage(newPage);
                fetchProperties(filters, newPage);
              }}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Page</span>
              <span className="font-semibold">{currentPage}</span>
              <span className="text-gray-600">of</span>
              <span className="font-semibold">
                {Math.ceil(totalResults / 10)}
              </span>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                fetchProperties(filters, newPage);
              }}
              disabled={currentPage >= Math.ceil(totalResults / 10)}
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AllListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <AllListingsContent />
    </Suspense>
  );
}
