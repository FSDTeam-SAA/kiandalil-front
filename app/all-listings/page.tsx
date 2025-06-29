"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search,
} from "lucide-react";
import { toast } from "sonner";

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
  createdAt: string;
}

function AllListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL params
  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") || "All Types";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialBeds = searchParams.get("beds") || "Any";
  const initialCountry = searchParams.get("country") || "";
  const initialSortBy = searchParams.get("sortBy") || "Most Recent";

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [houseType, setHouseType] = useState(initialType);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [beds, setBeds] = useState(initialBeds);
  const [country, setCountry] = useState(initialCountry);
  const [sortBy, setSortBy] = useState(initialSortBy);

  // Update URL parameters
  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (houseType !== "All Types") params.set("type", houseType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds !== "Any") params.set("beds", beds);
    if (country) params.set("country", country);
    if (sortBy !== "Most Recent") params.set("sortBy", sortBy);

    router.push(`/all-listings?${params.toString()}`);
  };

  // Fetch properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (houseType !== "All Types") params.set("type", houseType);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (beds !== "Any") params.set("beds", beds);
      if (country) params.set("country", country);
      params.set("page", currentPage.toString());

      // Add sorting
      if (sortBy === "Price Low to High") {
        params.set("sort", "price");
        params.set("order", "asc");
      } else if (sortBy === "Price High to Low") {
        params.set("sort", "price");
        params.set("order", "desc");
      } else if (sortBy === "Most Popular") {
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
  };

  // Fetch properties when filters or page changes
  useEffect(() => {
    fetchProperties();
  }, [
    searchQuery,
    houseType,
    minPrice,
    maxPrice,
    beds,
    country,
    sortBy,
    currentPage,
  ]);

  // Update URL when filters change
  useEffect(() => {
    updateURL();
  }, [searchQuery, houseType, minPrice, maxPrice, beds, country, sortBy]);

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchProperties();
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => router.push(`/property/${property._id}`)}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Property Images */}
        <div className="relative h-64 md:h-48">
          <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium z-10">
            {property.images.length}
          </div>
          <div className="grid grid-cols-2 gap-1 h-full">
            <div className="relative">
              <Image
                src={
                  property.images[0] || "/placeholder.svg?height=200&width=300"
                }
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-1">
              <div className="relative">
                <Image
                  src={
                    property.images[1] ||
                    "/placeholder.svg?height=100&width=150"
                  }
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative">
                <Image
                  src={
                    property.images[2] ||
                    "/placeholder.svg?height=100&width=150"
                  }
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="md:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-[#191919] mb-2">
                  ${property.price?.toLocaleString() || "521,102"}
                </h3>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {property.quality.bed} Beds | High Quality | Luxury Lifestyle
                </h4>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">Location: {property.address}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                <Heart className="w-5 h-5 text-gray-400" />
              </Button>
            </div>

            <div className="flex items-center space-x-4 text-gray-600 mb-6">
              <span className="text-sm font-medium">{property.type}</span>
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span className="text-sm">Bed {property.quality.bed}</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span className="text-sm">Bath {property.quality.bath}</span>
              </div>
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.quality.sqrFt} sq ft</span>
              </div>
            </div>
          </div>

          {/* Agent Contact */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {property.userId.name.charAt(0)}
                </span>
              </div>
              <span className="font-medium text-gray-800">
                {property.userId.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>What's App</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
              <span>Back to listing</span>
            </Button>
            <span>/</span>
            <span>Home</span>
            <span>/</span>
            <span className="text-[#191919] font-medium">Buy</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleFilterChange()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Type
              </label>
              <Select
                value={houseType}
                onValueChange={(value) => {
                  setHouseType(value);
                  handleFilterChange();
                }}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <Input
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleFilterChange()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Min
              </label>
              <Input
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                type="number"
                onKeyPress={(e) => e.key === "Enter" && handleFilterChange()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Max
              </label>
              <Input
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                type="number"
                onKeyPress={(e) => e.key === "Enter" && handleFilterChange()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beds
              </label>
              <Select
                value={beds}
                onValueChange={(value) => {
                  setBeds(value);
                  handleFilterChange();
                }}
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
            <Button
              onClick={handleFilterChange}
              className="bg-[#191919] hover:bg-[#2a2a2a] text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Properties For Sale</span>
            <span className="font-semibold text-[#191919]">
              {totalResults} results
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Sort:</span>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Most Recent">Most Recent</SelectItem>
                <SelectItem value="Price Low to High">
                  Price Low to High
                </SelectItem>
                <SelectItem value="Price High to Low">
                  Price High to Low
                </SelectItem>
                <SelectItem value="Most Popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && properties.length > 0 && (
          <div className="flex items-center justify-between mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Page</span>
              <span className="font-semibold">{currentPage}</span>
              <span className="text-gray-600">of</span>
              <span className="font-semibold">
                {Math.ceil(totalResults / 10)}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= Math.ceil(totalResults / 10)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllListingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllListingsContent />
    </Suspense>
  );
}
