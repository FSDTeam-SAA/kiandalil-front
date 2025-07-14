"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { fetchApprovedProperties } from "@/lib/api"
import Link from "next/link"

export interface Property {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    type: string;
    features: string[];
    images: string[];
    approve: boolean;
    createdAt: string;
    updatedAt: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    __v: number;
}


export default function Dashboard() {

    const { data: approvedProperties, isLoading } = useQuery({
        queryKey: ["approvedProperties"],
        queryFn: fetchApprovedProperties,
        select: (data) => data.data
    })


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        })
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Welcome to admin page</p>
            </div>

            {/* Total Properties Card */}
            <Card className="bg-black text-white">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">Total Properties</h2>
                            <Progress value={approvedProperties?.length} className="w-96 h-2" />
                            <p className="text-gray-400">{100 - approvedProperties?.length} more to touch 100 properties</p>
                        </div>
                        <div className="text-6xl font-bold">{approvedProperties?.length}</div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* All Listing Table */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Listing</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer Name</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Items</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {approvedProperties?.slice(0, 5).map((property: Property) => (
                                        <TableRow key={property?._id}>
                                            <TableCell>{property?._id.slice(-4)}</TableCell>
                                            <TableCell>{formatDate(property.createdAt)}</TableCell>
                                            <TableCell>{property?.userId?.name}</TableCell>
                                            <TableCell>{property?.address}, {property?.city}</TableCell>
                                            <TableCell>1 {property?.type}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4 text-end pr-5">
                                <Link href="dashboard/properties-listing" className="underline ">See More</Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Total Listing Stats */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Listing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-lg text-green-600">Approved: {approvedProperties?.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
