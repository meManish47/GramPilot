"use client";
import { useState } from "react";

export default function UploadImage() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSize = 1024 * 1024; // 1MB

    if (file) {
      if (file.size > maxSize) {
        alert("File size must be less than 1MB");
        e.target.value = "";
        setFileName("");
        return;
      }

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "onepost");
      data.append("cloud_name", "dblyzoahe");

      try {
        setLoading(true);
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dblyzoahe/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const x = await res.json();

        const optimizedUrl = `https://res.cloudinary.com/${x.cloud_name}/image/upload/f_jpg,q_auto,w_1080,c_fit/${x.public_id}.jpg`;
        setUrl(optimizedUrl);
        setFileName(file.name);
      } catch (err) {
        alert("Upload failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full space-y-2 text-white">
      <label htmlFor="avatarUpload" className="block font-semibold ">
        Upload your image
      </label>
      <input
        id="avatarUpload"
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
        className="block w-full text-sm text-white border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400
                   file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <p className="text-xs ">
        Max size: 1MB • JPG, PNG only (optimized for social media)
      </p>
      {loading && <span className="text-xs text-blue-500">Uploading...</span>}
      {fileName && !loading && (
        <span className="text-xs ">Selected: {fileName}</span>
      )}
    </div>
  );
}
