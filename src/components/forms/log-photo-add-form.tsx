import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLog } from "@/hooks/useLog";
import axiosInstance from "@/api/axiosInstance";
import { Loader2 } from "lucide-react";
interface AddImageComponentProps {
  setIsOpen: (isOpen: boolean) => void;
  patientID: string;
  logID: string;
}

const AddImageComponent: React.FC<AddImageComponentProps> = ({
  patientID,
  logID,
  setIsOpen,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();
  const { addPhotoToLog } = useLog();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(""); // Clear any previous errors
    }
  };

  // Upload file to S3 via pre-signed URL
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setErrorMessage("");

    try {
      // Step 1: Get Pre-signed URL from the backend
      const presignedUrlResponse = await axiosInstance.post<{
        url: string;
        key: string;

      }>(`/s3/generate-presigned-url`, {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      });

      const { url, key } = presignedUrlResponse.data;

      // Step 2: Upload the file to S3
      await axios.put(url, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
        withCredentials: true, // Ensures cookies and credentials are sent
      });

      // Step 3: Store the S3 key in the backend and update state
      await addPhotoToLog(patientID, logID, key);

      toast({
        title: "Image Uploaded",
        description: "Image has been uploaded successfully",
      });

      // Clear the selection
      setSelectedFile(null);

      // Close the dialog
      setIsOpen(false);
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        title: "Error uploading image",
        description:
          error.response?.data?.details?.error ||
          "An error occurred while uploading the image",
        variant: "destructive",
      });
      setErrorMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="px-5 md:px-0 rounded-lg">
      <h2 className="text-lg font-semibold">Upload Image</h2>
      <Input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="mt-2"
        disabled={uploading}
      />
      <Button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="mt-4 w-full"
      >
        {uploading ? (
          <span className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </span>
        ) : (
          "Upload Image"
        )}
      </Button>

      {errorMessage && (
        <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};

export default AddImageComponent;
