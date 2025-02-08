"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SimpleUploadForm() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/simple-upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Error uploading file. Please try again.");
      setResponse(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple File Upload</CardTitle>
        <CardDescription>Upload a file using FormData</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="file"
            multiple
            onChange={(e) =>
              setFiles(e.target.files ? Array.from(e.target.files) : null)
            }
          />
          <Button type="submit" disabled={!files}>
            Upload
          </Button>
        </form>
        {error && (
          <div className="mt-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
        {response && (
          <div className="mt-4">
            <h3 className="font-semibold">Response:</h3>
            <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-x-auto">
              {response}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
