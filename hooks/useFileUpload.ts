import { useState } from "react";
import { authorizedRequest } from "@/lib/api";

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
  url?: string; // Add URL field for Cloudinary URLs
}

export interface FileUploadOptions {
  endpoint: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // mime types
  maxFiles?: number;
  fieldName?: string; // name of the field in FormData
  onProgress?: (progress: number) => void;
}

export interface FileUploadResponse {
  files?: UploadedFile[];
  imageUrls?: string[]; // For Cloudinary URLs
  message?: string;
}

export function useFileUpload(defaultOptions?: Partial<FileUploadOptions>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const uploadFiles = async (
    files: File[],
    options: Partial<FileUploadOptions> = {}
  ): Promise<FileUploadResponse> => {
    // Combine default options with provided options
    const mergedOptions: FileUploadOptions = {
      endpoint: "/upload",
      maxSize: 5 * 1024 * 1024, // 5MB default
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      maxFiles: 5,
      fieldName: "files", // default field name
      ...defaultOptions,
      ...options,
    };

    // Reset state
    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      console.log("Starting file upload to", mergedOptions.endpoint);
      console.log(
        "Files:",
        files.map((f) => ({ name: f.name, type: f.type, size: f.size }))
      );

      // Validate files
      if (files.length > mergedOptions.maxFiles!) {
        throw new Error(`Maximum ${mergedOptions.maxFiles} files allowed`);
      }

      // Check file types and sizes
      for (const file of files) {
        if (
          mergedOptions.allowedTypes &&
          !mergedOptions.allowedTypes.includes(file.type)
        ) {
          throw new Error(`File type ${file.type} is not allowed`);
        }

        if (file.size > mergedOptions.maxSize!) {
          throw new Error(
            `File ${file.name} exceeds maximum size of ${
              mergedOptions.maxSize! / (1024 * 1024)
            }MB`
          );
        }
      }

      // Create form data
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(mergedOptions.fieldName!, file);
      });

      // Upload files
      console.log(
        `Uploading ${files.length} files with field name: ${mergedOptions.fieldName}`
      );

      try {
        const response = await authorizedRequest(mergedOptions.endpoint, {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Upload response:", response.data);

        // Handle Cloudinary URLs if they exist in the response
        const responseData: FileUploadResponse = { ...response.data };
        
        if (response.data.imageUrls && Array.isArray(response.data.imageUrls)) {
          setUploadedUrls(response.data.imageUrls);
          
          // Create synthetic file objects from the URLs
          responseData.files = response.data.imageUrls.map((url: string, index: number) => ({
            fieldname: mergedOptions.fieldName!,
            originalname: files[index]?.name || `file-${index}`,
            encoding: "utf-8",
            mimetype: files[index]?.type || "image/jpeg",
            destination: "",
            filename: url,
            path: url,
            size: files[index]?.size || 0,
            url: url
          }));
        }
        
        return responseData;
      } catch (apiError: any) {
        console.error("API request error:", apiError);
        console.error("Response data:", apiError.response?.data);
        throw apiError;
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "File upload failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFiles,
    isLoading,
    progress,
    error,
    uploadedUrls,
  };
}
