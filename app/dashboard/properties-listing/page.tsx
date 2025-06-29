"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { fetchApprovedProperties } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

interface Property {
    _id: string
    title: string
    subtitle: string
    type: string
    description: string
    features: string[]
    userId: {
        name: string
        email: string
    }
    country: string
    state: string
    city: string
    address: string
    images: string[]
    createdAt: string
}

export default function PropertiesPage() {

    const { data: approvedProperties, isLoading } = useQuery({
        queryKey: ["approvedProperties"],
        queryFn: fetchApprovedProperties,
        select: (data) => data.data
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Total Properties Listings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>All Properties ({approvedProperties?.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Features</TableHead>
                                <TableHead>Date Added</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {approvedProperties?.map((property: Property) => (
                                <TableRow key={property._id}>
                                    <TableCell>
                                        <Image
                                            src={property.images[0] || "/placeholder.svg?height=50&width=50"}
                                            alt={property.title}
                                            width={50}
                                            height={50}
                                            className="object-cover w-[80px] h-[60px] rounded"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{property.title}</p>
                                            <p className="text-sm text-gray-500">{property.subtitle}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{property.type}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{property.userId.name}</p>
                                            <p className="text-sm text-gray-500">{property.userId.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p>
                                                {property.city}, {property.state}
                                            </p>
                                            <p className="text-sm text-gray-500">{property.country}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {property.features.slice(0, 2).map((feature, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                                                    {feature}
                                                </span>
                                            ))}
                                            {property.features.length > 2 && (
                                                <span className="text-xs text-gray-500">+{property.features.length - 2} more</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(property.createdAt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
