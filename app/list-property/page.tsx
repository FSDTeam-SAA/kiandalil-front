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
  units: z.string().min(1, "Number of units is required"),
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
  phoneNum: z.number().nullable().default(null),
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

  const [priceWarning, setPriceWarning] = useState<string>("");

  const [unitWarning, setunitWarning] = useState<string>("");
  const [bedWarning, setbedWarning] = useState<string>("");
  const [bathWarning, setbathWarning] = useState<string>("");
  const [sqrFtWarning, setsqrFtWarning] = useState<string>("");

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      subtitle: "",
      units: "",
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
      phoneNum: null,
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
      formData.append("units", data.units);
      formData.append("description", data.description);
      formData.append("features", JSON.stringify(data.features));
      formData.append("country", data.country);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("zipCode", data.zipCode);
      formData.append("address", data.address);
      formData.append("offmarket", data.offmarket.toString());
      formData.append("whatsappNum", data.whatsappNum?.toString() || "");
      formData.append("phoneNum", data.phoneNum?.toString() || "");

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
                        <FormLabel className="lg:text-base text-sm">
                          Listing Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Short, clear headline for the property"
                            {...field}
                          />
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
                        <FormLabel className="lg:text-base text-sm">
                          Subtitle
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="One line that adds quick context"
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
                        <FormLabel className="lg:text-base text-sm">
                          Asking Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the current asking price"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e); // keep React Hook Form updated
                              // Check for special characters
                              if (/[^0-9.]/.test(e.target.value)) {
                                setPriceWarning("Warning: Avoid special characters like $, @, , etc.");
                              } else {
                                setPriceWarning(""); // clear warning if input is valid
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage /> {/* keeps normal error messages */}
                        {priceWarning && <p className="text-red-600 text-sm mt-1">{priceWarning}</p>}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="lg:text-base text-sm">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the property, condition, and key details buyers should know."
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
                          <FormLabel className="lg:text-base text-sm">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Your contact number."
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

                    <FormField
                      control={form.control}
                      name="whatsappNum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="lg:text-base text-sm">
                            WhatsApp Number (optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="WhatsApp contact number."
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
                          <FormLabel className="lg:text-base text-sm">
                            Features{" "}
                            <span className="opacity-60 text-sm">
                              (Select any features that apply)
                            </span>
                          </FormLabel>
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
                        <FormLabel className="lg:text-base text-sm">
                          Property Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose the type of property." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="singleFamily">
                              Single-Family
                            </SelectItem>
                            <SelectItem value="multiFamily">
                              Multifamily
                            </SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="industrial">
                              Industrial
                            </SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="units"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="lg:text-base text-sm">
                          Units
                        </FormLabel>
                        <Input
                          type="number"
                          placeholder="Enter number of units, if applicable."
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(e.target.value === "" ? "" : value);

                            if (value <= 0) {
                              setunitWarning("Please enter a number greater than 0.");
                            } else {
                              setunitWarning("");
                            }
                          }}
                          value={field.value === null ? "" : field.value}
                          style={{ MozAppearance: "textfield" }}
                          className="no-spinner"
                        />
                        <FormMessage />
                        {unitWarning && <p className="text-red-600 text-sm mt-1">{unitWarning}</p>}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="lg:text-base text-sm">
                          Bedrooms
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of bedrooms."
                            {...field}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(e.target.value === "" ? "" : value);

                              if (value <= 0) {
                                setbedWarning("Please enter a number greater than 0.");
                              } else {
                                setbedWarning("");
                              }
                            }}
                            value={field.value === null ? "" : field.value}
                            style={{ MozAppearance: "textfield" }}
                            className="no-spinner"
                          />
                        </FormControl>
                        <FormMessage />
                        {bedWarning && <p className="text-red-600 text-sm mt-1">{bedWarning}</p>}
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
                        <FormLabel className="lg:text-base text-sm">
                          Bathrooms
                        </FormLabel>
                        <Input
                          type="number"
                          placeholder="Number of bathrooms."
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(e.target.value === "" ? "" : value);

                            if (value <= 0) {
                              setbathWarning("Please enter a number greater than 0.");
                            } else {
                              setbathWarning("");
                            }
                          }}
                          value={field.value === null ? "" : field.value}
                          style={{ MozAppearance: "textfield" }}
                          className="no-spinner"
                        />
                        <FormMessage />
                        {bathWarning && <p className="text-red-600 text-sm mt-1">{bathWarning}</p>}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sqrFt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="lg:text-base text-sm">
                          Square Feet
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter total square footage."
                            {...field}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(e.target.value === "" ? "" : value);

                              if (value <= 0) {
                                setsqrFtWarning("Please enter a number greater than 0.");
                              } else {
                                setsqrFtWarning("");
                              }
                            }}
                            value={field.value === null ? "" : field.value}
                            style={{ MozAppearance: "textfield" }}
                            className="no-spinner"
                          />
                        </FormControl>
                        <FormMessage />
                        {sqrFtWarning && <p className="text-red-600 text-sm mt-1">{sqrFtWarning}</p>}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Off Market Checkbox */}
                <FormField
                  control={form.control}
                  name="offmarket"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="lg:text-base text-sm">
                          Off Market Property{" "}
                          <span className="opacity-60 text-sm">
                            (Check if this is off market)
                          </span>
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <div className="space-y-4">
                  <FormLabel className="lg:text-base text-sm">
                    Upload Property Images
                  </FormLabel>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
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
                  <p className="text-sm text-gray-500">Add up to 10 photos.</p>

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
                          <FormLabel className="lg:text-base text-sm">
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter property country"
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
                          <FormLabel className="lg:text-base text-sm">
                            State
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter property state"
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
                          <FormLabel className="lg:text-base text-sm">
                            City
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter property city"
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
                          <FormLabel className="lg:text-base text-sm">
                            Zip Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter property zip code"
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
                        <FormLabel className="lg:text-base text-sm">
                          Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full property address."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#191919] hover:bg-[#2a2a2a] text-white py-3"
                  disabled={isSubmitting || unitWarning !== "" || bedWarning !== "" || bathWarning !== "" || sqrFtWarning !== "" || priceWarning !== ""}
                >
                  {isSubmitting ? "Submitting..." : "Submit Your Listing"}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
