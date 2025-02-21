import React, { useState } from "react";
import axios from "axios";
import { ColumnGrouping } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddImageComponentProps {
  patientID: string;
  logID: string;
}

const AddImageComponent: React.FC<AddImageComponentProps> = ({
  patientID,
  logID,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      const presignedUrlResponse = await axios.post<{
        url: string;
        key: string;
      }>(
        `http://localhost:8080/api/s3/generate-presigned-url`,
        {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        },
        {
          withCredentials: true, // Ensures cookies and credentials are sent
        }
      );

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
      await axios.post(
        `http://localhost:8080/api/patients/${patientID}/logs/${logID}/photos`,
        {
          s3Keys: [key],
        },
        {
          withCredentials: true, // Ensures cookies and credentials are sent
        }
      );
      console.log("done");

      setUploadSuccess("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mt-4 p-4 border  rounded-lg">
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
    </Card>
  );
};

export default AddImageComponent;
