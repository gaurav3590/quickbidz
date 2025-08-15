import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, File, Image, Loader2 } from 'lucide-react';
import { useFileUpload, FileUploadOptions, UploadedFile } from '@/hooks/useFileUpload';

export type { UploadedFile };

export interface FileUploadProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  endpoint?: string;
  fieldName?: string;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
  showPreview?: boolean;
  className?: string;
  multiple?: boolean;
  value?: File[];
  onChange?: (files: File[]) => void;
}

export function FileUpload({
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  endpoint = '/api/upload',
  fieldName = 'files',
  onUploadComplete,
  onError,
  label = 'Upload Files',
  description,
  required = false,
  showPreview = true,
  className = '',
  multiple = true,
  value = [],
  onChange,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>(value);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { uploadFiles, isLoading: isHookUploading, error } = useFileUpload({
    endpoint,
    maxFiles,
    maxSize,
    allowedTypes,
    fieldName,
  });

  useEffect(() => {
    // Clean up previous preview URLs
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (value && value.length > 0) {
      setFiles(value);
      // Generate preview URLs for the files
      const urls = value.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  }, [value]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      // For single file uploads, replace existing files instead of appending
      const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;

      // Limit to maxFiles
      if (newFiles.length > maxFiles) {
        if (onError) onError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Revoke existing preview URLs if replacing in single file mode
      if (!multiple) {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
      }

      // Create preview URLs for the images
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));

      setFiles(newFiles);
      setPreviewUrls(multiple ? [...previewUrls, ...newPreviewUrls] : newPreviewUrls);

      if (onChange) {
        onChange(newFiles);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);

    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);

    if (onChange) {
      onChange(newFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      if (onError) onError('No files selected');
      return;
    }
    
    setIsUploading(true);
    console.log(`Starting upload of ${files.length} files to ${endpoint} with field name: ${fieldName}`);
    
    try {
      const response = await uploadFiles(files, { fieldName });
      console.log('Upload complete, response:', response);
      
      // Check if we have files in the response, or generate them from imageUrls if needed
      if (onUploadComplete) {
        if (response.files && response.files.length > 0) {
          onUploadComplete(response.files);
        } else if (response.imageUrls && response.imageUrls.length > 0) {
          // Create synthetic file objects from the imageUrls
          const syntheticFiles = response.imageUrls.map((url, index) => ({
            fieldname: fieldName,
            originalname: files[index]?.name || `file-${index}`,
            encoding: 'utf-8',
            mimetype: files[index]?.type || 'image/jpeg',
            destination: '',
            filename: url,
            path: url,
            size: files[index]?.size || 0,
            url: url
          }));
          onUploadComplete(syntheticFiles);
        } else {
          if (onError) onError('No files returned from server');
        }
      }
    } catch (err: any) {
      // Error is already handled by the hook
      console.error('Upload error in component:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <Label>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>}

      {/* File preview */}
      {showPreview && previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <div className="h-32 w-32 border rounded-md overflow-hidden">
                {files[index].type.startsWith('image/') ? (
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted/30">
                    {getFileIcon(files[index])}
                    <span className="ml-2 text-xs">{files[index].name}</span>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => handleRemoveFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* File input */}
      {files.length < maxFiles && (
        <div className="flex items-center space-x-4">
          <Label
            htmlFor="files"
            className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-sm transition hover:bg-accent"
          >
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Upload className="h-4 w-4 mb-1" />
              <span className="text-xs text-center px-2">
                Upload {multiple ? 'Files' : 'File'}
              </span>
            </div>
            <Input
              id="files"
              type="file"
              accept={allowedTypes.join(',')}
              onChange={handleFileChange}
              className="sr-only"
              multiple={multiple}
            />
          </Label>
          {description && (
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || isHookUploading}
          className="mt-2"
        >
          {isUploading || isHookUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Files'
          )}
        </Button>
      )}
    </div>
  );
} 