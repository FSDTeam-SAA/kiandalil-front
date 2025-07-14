"use client"


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { fetchAllUsers } from "@/lib/api"


export interface User {
    _id: string;
    name: string;
    email: string;
    phoneNum: string;
    whatsappNum: string | null;
    role: "admin" | "user" | "moderator";
    avatar: {
        url: string;
    };
    verificationInfo: {
        token: string;
        verified: boolean;
    };
    wishlist: any[];
    createdAt: string;
}

export default function UsersPage() {


    const { data: allUsers } = useQuery({
        queryKey: ["users"],
        queryFn: fetchAllUsers,
        select: (data) => data.data
    })

    console.log(allUsers)


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Verified Users</h1>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Name</TableHead>
                                <TableHead className="text-center">Email</TableHead>
                                <TableHead className="text-center">Phone</TableHead>
                                <TableHead className="text-center">What&apos;s App</TableHead>
                                <TableHead className="text-center">Joined Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allUsers?.map((user: User) => (
                                <TableRow key={user._id}>
                                    <TableCell className="text-center">{user.name}</TableCell>
                                    <TableCell className="text-center">{user.email}</TableCell>
                                    <TableCell className="text-center">{user.phoneNum ?? "N/A"}</TableCell>
                                    <TableCell className="text-center">{user.whatsappNum ?? "N/A"}</TableCell>
                                    <TableCell className="text-center">
                                        {
                                            new Date(user.createdAt).toLocaleString(
                                                "en-US",
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
