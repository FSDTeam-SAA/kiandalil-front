"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const propertySchema = z.object({
  title: z.string().min(2, "Property name is required"),
  subtitle: z.string().min(2, "Subtitle is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Price must be a positive number"),
  type: z.string().min(1, "Property type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(3, "Zip code is required"),
  address: z.string().min(5, "Full address is required"),
  propertyType: z.string().min(1, "Property type is required"),
  bed: z.string().min(1, "Number of beds is required"),
  bath: z.string().min(1, "Number of baths is required"),
  sqrFt: z.string().min(1, "Square footage is required"),
  offmarket: z.boolean().default(false),
  whatsappNum: z.number().nullable().default(null),
  phoneNum: z.string().min(1, "Phone number is required"),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const availableFeatures = [
  "Balcony",
  "Lift",
  "Garage",
  "Swimming Pool",
  "Garden",
  "Gym",
  "Security",
  "Parking",
  "Air Conditioning",
  "Heating",
];

export default function ListPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [dragActive, setDragActive] = useState(false);
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      subtitle: "",
      type: "",
      description: "",
      features: [],
      country: "",
      state: "",
      city: "",
      zipCode: "",
      address: "",
      propertyType: "",
      bed: "",
      bath: "",
      sqrFt: "",
      price: "",
      offmarket: false,
      whatsappNum: null,
      phoneNum: "",
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      handleFiles(files);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files).filter((file) =>
          file.type.startsWith("image/")
        );
        handleFiles(files);
      }
    },
    []
  );

  const handleFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      const remainingSlots = 10 - uploadedImages.length;
      if (remainingSlots <= 0) {
        toast.error("You can only upload up to 10 images");
        return;
      }

      const filesToAdd = files.slice(0, remainingSlots).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setUploadedImages((prev) => [...prev, ...filesToAdd]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadedImages]
  );

  const removeImage = useCallback(
    (index: number) => {
      URL.revokeObjectURL(uploadedImages[index].preview);
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    },
    [uploadedImages]
  );

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [uploadedImages]);

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Add all form fields
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("price", data.price);
      formData.append("type", data.type);
      formData.append("description", data.description);
      formData.append("features", JSON.stringify(data.features));
      formData.append("country", data.country);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("zipCode", data.zipCode);
      formData.append("address", data.address);
      formData.append("offmarket", data.offmarket.toString());
      formData.append("whatsappNum", data.whatsappNum?.toString() || "");
      formData.append("phoneNum", data.phoneNum);

      // Add quality object as JSON string
      const quality = {
        propertyType: data.propertyType,
        bed: data.bed,
        bath: data.bath,
        sqrFt: data.sqrFt,
      };
      formData.append("quality", JSON.stringify(quality));

      // Add images
      uploadedImages.forEach((image) => {
        formData.append("images", image.file);
      });

      // Replace with your actual API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/properties`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("Property listed successfully!");
        form.reset();
        setUploadedImages([]);
      } else {
        throw new Error("Failed to create property");
      }
    } catch (error) {
      toast.error("Failed to list property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log(session);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#191919] mb-4">
              List your property
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Basic Information */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name Of Property</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Property Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Property Subtitle"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Property Price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write About Property"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* New Contact Information Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsappNum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Number (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter WhatsApp number"
                              type="number"
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? null : Number(value)
                                );
                              }}
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Features and Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="features"
                      render={() => (
                        <FormItem>
                          <FormLabel>Features</FormLabel>
                          <div className="space-y-2">
                            {availableFeatures.map((feature) => (
                              <FormField
                                key={feature}
                                control={form.control}
                                name="features"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={feature}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            feature
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  feature,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== feature
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {feature}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">
                              Residential
                            </SelectItem>
                            <SelectItem value="commercial">
                              Commercial
                            </SelectItem>
                            <SelectItem value="industrial">
                              Industrial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="duplex">Duplex</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bed</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5+">5+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bath</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5+">5+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sqrFt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sqr. Ft.</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter square footage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Off Market Checkbox */}
                <FormField
                  control={form.control}
                  name="offmarket"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Off Market Property</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <div className="space-y-4">
                  <FormLabel>Upload Property Image</FormLabel>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-[#191919] bg-gray-50"
                        : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Drop your files here</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    You can add up to 10 images
                  </p>

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-3">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={image.preview}
                                alt={image.file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{image.file.name}</p>
                              <div className="w-32 h-2 bg-gray-200 rounded-full">
                                <div className="w-full h-2 bg-[#191919] rounded-full"></div>
                              </div>
                              <p className="text-sm text-gray-500">Completed</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Property Country"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Property State"
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
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Property City"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Property Zip Code"
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Full Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#191919] hover:bg-[#2a2a2a] text-white py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Listing"}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
