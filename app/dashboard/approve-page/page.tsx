"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchApprovedProperties,
  fetchUnApprovedProperties,
  updatePropertyStatus,
} from "@/lib/api";
import { toast } from "sonner";

interface Property {
  _id: string;
  title: string;
  subtitle: string;
  type: string;
  description: string;
  features: string[];
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  country: string;
  state: string;
  city: string;
  address: string;
  images: string[];
  createdAt: string;
  approve: boolean;
}

export default function ApprovePage() {
  const queryClient = useQueryClient();

  const { data: unApprovedProperties, isLoading } = useQuery({
    queryKey: ["unApprovedProperties"],
    queryFn: fetchUnApprovedProperties,
    select: (data) => data.data,
  });

  const { mutate: updatePropertyMutation } = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      updatePropertyStatus(id, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unApprovedProperties"] });
      toast.success("Property status updated!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleApprove = async (propertyId: string, approve: boolean) => {
    updatePropertyMutation({ id: propertyId, approve });
  };

  const formatDate = (dateString: string) => {
    return (
      new Date(dateString).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }) +
      ", " +
      new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Post Approve Page</h1>

      <div className="space-y-6">
        {unApprovedProperties?.map((property: Property) => (
          <Card key={property._id} className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>
                    {property.userId.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* User Info and Description */}
                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <h3 className="font-semibold text-sm">
                      {property.userId.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Join on {formatDate(property.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {property.description} - {property.title} in {property.city}
                    , {property.state}
                  </p>
                </div>

                {/* Rating and Actions */}
                <div className="flex items-center space-x-4 flex-shrink-0">
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50 px-4 py-1 text-xs"
                      onClick={() => handleApprove(property._id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50 px-4 py-1 text-xs"
                      onClick={() => handleApprove(property._id, false)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {unApprovedProperties?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No properties pending approval</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
