import React, { useState } from "react";
import axios from "axios";
import { ColumnGrouping } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLog } from "@/hooks/useLog";
import axiosInstance from "@/api/axiosInstance";
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
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();
  const { addPhotoToLog } = useLog();
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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

      console.log(selectedFile.name, selectedFile.type);
      const presignedUrlResponse = await axiosInstance.post<{
        url: string;
        key: string;
      }>(`/s3/generate-presigned-url`, {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      });

      const { url, key } = presignedUrlResponse.data;
      console.log(url, key);
      // Step 2: Upload the file to S3
      console.log(selectedFile);
      await axios.put(url, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
        withCredentials: true, // Ensures cookies and credentials are sent
      });

      // Step 3: Store the S3 key in the backend
      console.log();
      await addPhotoToLog(patientID, logID, key);

      toast({
        title: "Image Uploaded",
        description: "Image has been uploaded successfully",
      });
      setUploadSuccess("File uploaded successfully!");
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        title: "Error creating log",
        description:
          error.response?.data?.details.error ||
          "An error occurred while creating the log",
        variant: "destructive",
      });
      setErrorMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="  px-5 md:px-0  rounded-lg">
      <h2 className="text-lg font-semibold">Upload Image</h2>
      <Input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="mt-2"
      />
      <Button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-2 px-4 py-2 "
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>

      {uploadSuccess && <p className="text-green-500 mt-2">{uploadSuccess}</p>}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default AddImageComponent;
