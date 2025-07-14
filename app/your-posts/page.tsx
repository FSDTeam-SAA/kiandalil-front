"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Edit,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Property {
  _id: string;
  title: string;
  subtitle: string;
  images: string[];
  country: string;
  state: string;
  city: string;
  address: string;
  quality: {
    bed: string;
    bath: string;
    sqrFt: string;
  };
  price?: number;
  createdAt: string;
  approve: boolean;
}

export default function YourPostsPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  console.log(session?.user?.id);
  const userId = session?.user?.id;
  const token = session?.user?.accessToken;

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/properties/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json", // Often good to include, even for GET
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setProperties(data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch your properties");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [session?.user]);

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
        toast.success("Property deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete property");
    }
  };

  const handleEdit = (propertyId: string) => {
    router.push(`/edit-property/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#191919] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

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
            <span className="text-[#191919] font-medium">Your posts</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center md:flex justify-between mb-8">
            <div />
            <h1 className="text-4xl font-bold text-[#191919] mb-4 md:ml-[200px]">
              Your Posts
            </h1>

            <Link href="/list-property">
              <Button className=" text-white px-8 py-3">
                List Another Property
              </Button>
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-8">
                You haven't listed any properties yet.
              </p>
              <Button
                onClick={() => router.push("/list-property")}
                className="bg-[#191919] hover:bg-[#2a2a2a] text-white px-8 py-3"
              >
                List Your First Property
              </Button>
            </div>
          ) : (
            <div className=" mx-auto space-y-8">
              {properties.map((property, index) => (
                <motion.div
                  key={property._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-[35%_63%] gap-6 p-6">
                    {/* Property Image */}
                    <div className="relative h-64 rounded-xl overflow-hidden ">
                      <Image
                        src={
                          property.images[0] ||
                          "/placeholder.svg?height=300&width=400"
                        }
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Property Details */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-[#191919] mb-2">
                              $ {property.price?.toLocaleString() || "211,102"}
                            </h3>
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">
                              Four Bed Penthouse | Vacant | Furnished
                            </h4>
                            <div className="flex items-center text-gray-600 mb-4">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                Location: {property.address}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center space-x-2">
                            {!property.approve && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                PENDING
                              </span>
                            )}
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(property._id)}
                              className="p-2"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Button> */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(property._id)}
                              className="p-2"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-gray-600 mb-4">
                          <div className="flex items-center">
                            <span className="text-sm font-medium">
                              Multi Family
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              Bed {property.quality.bed}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              Bath {property.quality.bath}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {property.quality.sqrFt} sq ft
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Listed on{" "}
                          {new Date(property.createdAt).toLocaleDateString()}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(`/property/${property._id}`)
                          }
                          className="text-[#191919] border-[#191919] hover:bg-[#191919] hover:text-white"
                        >
                          View Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
