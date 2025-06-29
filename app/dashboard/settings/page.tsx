"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Save, Upload } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchSingleUser, updateUserProfile } from "@/lib/api"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

const profileFormSchema = z.object({
    firstName: z.string().min(1, {
        message: "First Name is required.",
    }),
    lastName: z.string().optional(),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().optional(),
    country: z.string().optional(),
    cityState: z.string().optional(),
    bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    const {data: session} = useSession();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            country: "",
            cityState: "",
            bio: "",
        },
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const { data: userDetails, isLoading, isError } = useQuery({
        queryKey: ["userDetails", session?.user?.id],
        queryFn: ({ queryKey }) => fetchSingleUser(queryKey[1] as string),
        select: (data) => data.data,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (userDetails) {
            form.reset({
                firstName: userDetails.name.split(' ')[0] || "",
                lastName: userDetails.name.split(' ')[1] || "",
                email: userDetails.email || "---",
                phone: userDetails.whatsappNum || "",
                country: userDetails.country || "",
                cityState: userDetails.cityState || "",
                bio: userDetails.bio || "",
            });
            setAvatarPreview(userDetails.avatar?.url || null);
        }
    }, [userDetails, form]);

    const onSubmit = async (data: ProfileFormValues) => {
        const name = `${data.firstName} ${data.lastName || ""}`.trim();

        const payload: any = {
            name,
            email: data.email,
            whatsappNum: data.phone, // Assuming whatsappNum for phone
            country: data.country,
            cityState: data.cityState,
            bio: data.bio,
        };

        if (avatarPreview) {
            payload.avatar = { url: avatarPreview };
        }

        try {
            const res = await updateUserProfile(userDetails?._id, payload);
            setIsEditing(false);
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ["userDetails", "684c07b63ade7f5378be0929"] });
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile.");
        }
    };

    const handleAvatarClick = () => {
        if (avatarInputRef.current && isEditing) {
            avatarInputRef.current.click();
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordSave = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }
        console.log("Updating password with data:", passwordData);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordForm(false);
        toast.success("Password updated successfully!");
    };

    const handleEdit = () => {
        setIsEditing(true);
        setShowPasswordForm(false);
    };

    const handleChangePassword = () => {
        setShowPasswordForm(true);
        setIsEditing(false);
    };

    if (isLoading) return <div className="text-center py-8">Loading user data...</div>;
    if (isError) return <div className="text-center py-8 text-red-500">Error loading user data.</div>;

    const displayName = userDetails?.name || form.getValues("firstName") || "N/A";
    const displayBio = form.getValues("bio");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Personal Information</h1>
                <Button
                    onClick={isEditing && !showPasswordForm ? form.handleSubmit(onSubmit) : handleEdit}
                    className="bg-black text-white hover:bg-gray-800"
                    disabled={showPasswordForm}
                >
                    {isEditing && !showPasswordForm ? (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </>
                    ) : (
                        <>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            <Card>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4">
                        {/* Adjusted section for the avatar and name with gray background */}
                        <div className="md:basis-1/4 flex justify-center md:justify-start">
                            <div className="relative rounded-full px-8 py-4 flex flex-col items-center justify-center min-w-[200px]">
                                <div className="relative group mb-2"> {/* Added group for hover effect */}
                                    <Avatar className="w-24 h-24 cursor-pointer" onClick={isEditing ? handleAvatarClick : undefined}>
                                        <AvatarImage src={avatarPreview || userDetails?.avatar?.url || "/placeholder-user.jpg"} />
                                        <AvatarFallback>
                                            {displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) || "NN"}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                            onClick={handleAvatarClick}
                                        >
                                            <Upload className="text-white w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={avatarInputRef}
                                    onChange={handleAvatarChange}
                                />
                                <h2 className="text-lg font-bold text-gray-800">{displayName}</h2>
                            </div>
                        </div>


                        <div className="md:basis-3/4 max-w-full text-center">
                            <h3 className="text-xl font-semibold mb-4">Bio</h3>
                            <p className="text-gray-600 leading-relaxed text-base">{displayBio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "}</p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="firstName"
                                                        placeholder="John"
                                                        disabled={!isEditing || showPasswordForm}
                                                        className="mt-1"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="lastName"
                                                        placeholder="..."
                                                        disabled={!isEditing || showPasswordForm}
                                                        className="mt-1"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        readOnly
                                                        id="email"
                                                        type="email"
                                                        placeholder="email@example.com"
                                                        disabled={true}
                                                        className="mt-1"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="phone"
                                                        placeholder="(xxx) xxx-xxxx"
                                                        disabled={!isEditing || showPasswordForm}
                                                        className="mt-1"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Country</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="country"
                                                        placeholder="USA"
                                                        disabled={!isEditing || showPasswordForm}
                                                        className="mt-1"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cityState"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">City/State</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="cityState"
                                                        placeholder="New York, NY"
                                                        disabled={!isEditing || showPasswordForm}
                                                        className="mt-1"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Bio</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="bio"
                                                    placeholder="Tell us about yourself..."
                                                    disabled={!isEditing || showPasswordForm}
                                                    className="mt-1"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>

                        {showPasswordForm && (
                            <div className="mt-8 pt-8 border-t">
                                <h3 className="text-lg font-semibold mb-6 text-center">Change Your Password</h3>
                                <div className="max-w-xl mx-auto space-y-4">
                                    <div>
                                        <Label
                                            htmlFor="currentPassword"
                                            className="text-sm font-medium text-gray-700 block text-center mb-2"
                                        >
                                            Enter previous password
                                        </Label>
                                        <Input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            placeholder="Password"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="text-center"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 block text-center mb-2">
                                            Enter new password
                                        </Label>
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            placeholder="Password"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="text-center"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="confirmPassword"
                                            className="text-sm font-medium text-gray-700 block text-center mb-2"
                                        >
                                            Confirm password
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Password"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="text-center"
                                        />
                                    </div>

                                    <Button onClick={handlePasswordSave} className="w-full bg-black text-white hover:bg-gray-800 mt-6">
                                        Save Password
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end mt-8">
                            {!showPasswordForm && (
                                <Button onClick={handleChangePassword} className="bg-black text-white hover:bg-gray-800">
                                    Change Password
                                </Button>
                            )}
                            {showPasswordForm && (
                                <Button onClick={() => setShowPasswordForm(false)} variant="outline">
                                    Cancel Password Change
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}