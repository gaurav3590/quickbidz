"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProtectedApi } from "@/lib/protectedApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { CalendarIcon, Plus, X, Upload, Loader2 } from "lucide-react";
import { POST } from "@/app/api/auctions/route";
import { FileUpload, UploadedFile } from "@/components/ui/file-upload";


// Categories (should match what your backend supports)
const categories = [
  "Electronics",
  "Collectibles",
  "Fashion",
  "Home & Garden",
  "Art",
  "Vehicles",
  "Jewelry",
  "Sports",
  "Books & Media",
  "Other",
];

// Condition options
const conditions = [
  "New",
  "Like New",
  "Excellent",
  "Good",
  "Fair",
  "Poor",
];

// Duration options in days
const durationOptions = [
  { value: 1, label: "1 day" },
  { value: 3, label: "3 days" },
  { value: 5, label: "5 days" },
  { value: 7, label: "7 days" },
  { value: 10, label: "10 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
];

export default function CreateAuctionForm() {
  const router = useRouter();
  const { post } = useProtectedApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    startingPrice: 0,
    reservePrice: 0,
    bidIncrements: 1,
    duration: 7,
    shippingCost: 0 as number,
    shippingLocations: [] as string[],
    returnPolicy: "",
    termsAccepted: false,
    startTime: new Date(),
    endTime: addDays(new Date(), 7),
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      termsAccepted: checked,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If duration changes, update end time based on start time
    if (name === "duration") {
      const days = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        endTime: addDays(prev.startTime, days),
      }));
    }
  };

  // Handle date changes
  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;

    setFormData((prev) => {
      // Update end time based on duration when start time changes
      const endTime = addDays(date, prev.duration);
      return {
        ...prev,
        startTime: date,
        endTime,
      };
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;

    setFormData((prev) => ({
      ...prev,
      endTime: date,
    }));
  };

  // Handle file changes
  const handleFileChange = (files: File[]) => {
    setImages(files);
  };

  // Handle file upload completion
  const handleUploadComplete = (files: UploadedFile[]) => {
    setUploadedFiles(files);

    // Extract URLs from the uploaded files
    const urls = files.map(file => file.url || file.path || file.filename);
    setImageUrls(urls);
    console.log("Extracted image URLs:", urls);

    toast.success(`${files.length} files uploaded successfully!`);
  };

  // Handle file upload error
  const handleUploadError = (error: string) => {
    toast.error(error);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!formData.termsAccepted) {
      toast.error("You must accept the terms and conditions");
      return;
    }

    // Check for image URLs instead of uploaded files
    if (imageUrls.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    // Validate the form data
    if (!formData.title || !formData.description || !formData.category || !formData.condition) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.startingPrice <= 0) {
      toast.error("Starting price must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    console.log("Creating auction with data:", { ...formData, imageUrls });

    try {
      // Create the auction data object
      const auctionData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        startingPrice: Number(formData.startingPrice),
        reservePrice: Number(formData.reservePrice),
        bidIncrements: Number(formData.bidIncrements),
        duration: Math.floor(Number(formData.duration)),
        shippingCost: Number(formData.shippingCost),
        returnPolicy: formData.returnPolicy,
        termsAccepted: formData.termsAccepted,
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        shippingLocations: formData.shippingLocations,
        imageUrls: imageUrls,
      };

      // Send the auction data to the server
      const response = await post('/auctions', auctionData);
      console.log("Auction created successfully:", response.data);

      toast.success("Auction created successfully!");
      router.push(`/auctions/${response.data.id}`);
    } catch (error: any) {
      console.error("Error creating auction:", error);
      toast.error(error.message || "Failed to create auction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create New Auction</CardTitle>
          <CardDescription>
            Fill out the form below to list your item for auction
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item in detail"
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition*</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange("condition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startingPrice">Starting Price ($)*</Label>
                  <Input
                    id="startingPrice"
                    name="startingPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.startingPrice}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reservePrice">Reserve Price ($)</Label>
                  <Input
                    id="reservePrice"
                    name="reservePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.reservePrice}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bidIncrements">Bid Increments ($)</Label>
                  <Input
                    id="bidIncrements"
                    name="bidIncrements"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.bidIncrements}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Auction Duration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Auction Duration</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(value) => handleSelectChange("duration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {format(formData.startTime, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startTime}
                        onSelect={handleStartDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {format(formData.endTime, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endTime}
                        onSelect={handleEndDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shipping Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
                  <Input
                    id="shippingCost"
                    name="shippingCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.shippingCost}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnPolicy">Return Policy</Label>
                  <Input
                    id="returnPolicy"
                    name="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={handleChange}
                    placeholder="E.g., 30-day returns, no returns, etc."
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images (Up to 5)</h3>

              <FileUpload
                maxFiles={5}
                maxSize={5 * 1024 * 1024} // 5MB
                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                endpoint="/upload/auction-images"
                onUploadComplete={handleUploadComplete}
                onError={handleUploadError}
                onChange={handleFileChange}
                value={images}
                label="Product Images"
                description="Upload product images (max 5). Supported formats: JPEG, PNG, WebP. Max size: 5MB per image."
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  I agree to the Terms and Conditions of QuickBidz Auctions
                </Label>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Auction"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 