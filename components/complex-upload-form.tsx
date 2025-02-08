"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface FormInputs {
  name: string;
  email: string;
  files: FileList;
}

export default function ComplexUploadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>(); // Here we could any validation with zod/yup/other
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const files = data.files;
    if (!files) return;

    const buildFiles = await Promise.all(
      Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              base64: base64.split(",")[1], // Remove the data:image/png;base64, part
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    const payload = {
      user: {
        name: data.name,
        email: data.email,
      },
      files: buildFiles,
    };

    try {
      const res = await fetch("/api/complex-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const responseData = await res.json();
      setResponse(JSON.stringify(responseData, null, 2));
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
        <CardTitle>Complex File Upload</CardTitle>
        <CardDescription>
          Upload a file with additional data using React Hook Form and Base64
          encoding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="file">File</Label>
            <Input
              id="files"
              type="file"
              multiple
              {...register("files", { required: "File is required" })}
            />
            {errors.files && (
              <p className="text-red-500 text-sm mt-1">
                {errors.files.message}
              </p>
            )}
          </div>
          <Button type="submit">Upload</Button>
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
