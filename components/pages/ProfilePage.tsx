"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/components/providers/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, ShieldCheck, Eye, EyeOff, Upload, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authorizedRequest } from "@/lib/api";

export default function ProfilePage() {
  const { user, updateProfile, setUser } =
    useUser();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    username: user?.username || "",
    dob: user?.dob ? moment(user.dob).format("MM-DD-YYYY") : "",
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [modalInitialized, setModalInitialized] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile image states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(user?.profileImage || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        username: user.username || "",
        dob: user.dob ? moment(user.dob).format("MM-DD-YYYY") : "",
      });

      if (user.profileImage) {
        setImagePreviewUrl(user.profileImage);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && !modalInitialized) {
      setModalInitialized(true);

      if (!user.dob) {
        setShowProfileModal(true);
      }
    }
  }, [user, modalInitialized]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "dob") {
      // Format the date input as user types
      let formattedValue = value;

      // Remove any non-digit characters
      formattedValue = formattedValue.replace(/\D/g, "");

      // Add dashes in the correct positions
      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "-" + formattedValue.slice(2);
      }
      if (formattedValue.length > 5) {
        formattedValue =
          formattedValue.slice(0, 5) + "-" + formattedValue.slice(5, 9);
      }

      // Validate the date format
      const isValidFormat = /^\d{2}-\d{2}-\d{4}$/.test(formattedValue);

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      if (isValidFormat) {
        const isValidAge = checkAge(formattedValue);
        setAgeError(!isValidAge);
      } else {
        setAgeError(false);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  // Handle profile image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
    }
  };

  // Clear selected image
  const handleClearImage = () => {
    if (selectedImage && imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImage(null);
    setImagePreviewUrl(user?.profileImage || null);
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await authorizedRequest('/users/profile-image', {
        method: 'POST',
        data: formData,
      });

      setImagePreviewUrl(response.data.imageUrl);
      setSelectedImage(null);
      if (user) {
        const updatedUser = { ...user, profileImage: response.data.imageUrl };
        setUser(updatedUser);
      }

      toast.success("Profile image updated successfully");

    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error(`Failed to upload profile image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswordData((prev) => ({
        ...prev,
        [name]: value,
      }));

      setPasswordError("");
    },
    []
  );

  const validatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    if (passwordData.newPassword && passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const checkAge = useCallback((dob: string) => {
    if (!dob) return false;

    const birthDate = moment(dob, "MM-DD-YYYY");
    const today = moment();
    const age = today.diff(birthDate, "years");

    return age >= 18;
  }, []);

  const updateFormData = useCallback(
    async (data: {
      username?: string;
      dob?: string;
      firstName?: string;
      lastName?: string;
    }) => {
      try {
        await updateProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          dateOfBirth: data.dob
            ? moment(data.dob, "MM-DD-YYYY").toDate()
            : undefined,
        });
        return true;
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error("Failed to update profile");
        return false;
      }
    },
    []
  );

  const handlePersonalInfoSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      if (formData.dob && !checkAge(formData.dob)) {
        setAgeError(true);
        toast.error(
          "You must be 18 or older to participate in auctions. Please contact administrator."
        );
        setIsSubmitting(false);
        return;
      }

      try {
        await updateFormData({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          dob: formData.dob,
        });
        toast.success("Profile information updated successfully");
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error("Failed to update profile information");
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const handlePasswordSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      if (!validatePassword()) {
        setIsSubmitting(false);
        return;
      }

      try {
        await updateProfile({
          password: passwordData.newPassword,
        });

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast.success("Password updated successfully!");
      } catch (error) {
        console.error("Failed to update password:", error);
        toast.error("Failed to update password");
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const handleCompleteProfile = useCallback(async () => {
    setIsSubmitting(true);

    if (formData.dob && !checkAge(formData.dob)) {
      setAgeError(true);
      toast.error(
        "You must be 18 or older to participate in auctions. Please contact administrator."
      );
      setIsSubmitting(false);
      return;
    }

    const success = await updateFormData({
      dob: formData.dob,
    });

    if (success) {
      setShowProfileModal(false);
    }
    setIsSubmitting(false);
  }, [formData]);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.firstName && !user?.lastName && !user?.username) return "U";

    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }

    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }

    return user?.firstName?.charAt(0).toUpperCase() || "U";
  };

  const ProfilePageSkeleton = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
      <Skeleton className="h-9 w-1/3 mb-6" /> {/* Page Title */}

      {/* TabsList Skeleton */}
      <div className="grid w-full grid-cols-3 gap-2 mb-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>

      {/* Personal Info Card Skeleton */}
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <Skeleton className="h-7 w-1/2 mb-1" /> {/* Card Title */}
          <Skeleton className="h-4 w-3/4" /> {/* Card Description */}
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* First Name & Last Name Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          {/* Email Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          {/* Username Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* DOB Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Save Button Skeleton */}
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  );

  if (!user) {
    // Show skeleton while user data is loading
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Please complete your profile information to continue using the
              platform.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="modal-dob">Date of Birth</Label>
              <Input
                id="modal-dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />
              {ageError && (
                <p className="text-sm text-red-500">
                  You must be 18 or older to participate in auctions. Please
                  contact administrator.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCompleteProfile}>Complete Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs
        defaultValue="personal"
        className="space-y-6"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="shadow-lg">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b">
                <div className="relative">
                  <Avatar className="w-32 h-32 mb-4">
                    {imagePreviewUrl ? (
                      <AvatarImage src={imagePreviewUrl} alt="Profile" />
                    ) : null}
                    <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                  </Avatar>

                  {selectedImage && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={handleClearImage}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label
                    htmlFor="profile-image"
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Select Image</span>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                      multiple={false}
                    />
                  </label>

                  <Button
                    onClick={handleUploadImage}
                    disabled={!selectedImage || isUploadingImage}
                    className="mt-2 sm:mt-0"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload Image"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Supported formats: JPEG, PNG, WebP<br />
                  Max size: 1MB
                </p>
              </div>

              <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your email address cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="text"
                    placeholder="MM-DD-YYYY"
                    maxLength={10}
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className="bg-background"
                  />
                  {ageError && (
                    <p className="text-sm text-red-500">
                      You must be 18 or older to participate in auctions. Please
                      contact administrator.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving changes...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-lg">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl">Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="bg-background"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="bg-background"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="bg-background"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="shadow-lg">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl">Account Preferences</CardTitle>
              <CardDescription>
                Customize your auction experience
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label
                        htmlFor="email-notifications"
                        className="text-base"
                      >
                        Email notifications for new auctions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="bid-notifications"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="bid-notifications" className="text-base">
                        Outbid notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="auction-ending"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="auction-ending" className="text-base">
                        Auction ending reminders
                      </Label>
                    </div>
                  </div>
                </div>
                <Button className="w-full md:w-auto">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
