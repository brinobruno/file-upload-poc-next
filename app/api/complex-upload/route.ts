import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user: { name, email },
      files,
    } = body;

    if (!files || !files.length) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = "/tmp/uploads";
    await mkdir(uploadsDir, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      const buffer = Buffer.from(file.base64, "base64");
      const fileExtension = extname(file.name);
      const uniqueFilename = `${file.name}-${uuidv4()}${fileExtension}`;
      const path = join(uploadsDir, uniqueFilename);
      await writeFile(path, buffer);

      uploadedFiles.push({
        filename: uniqueFilename,
        size: file.size,
        path: `/uploads/${uniqueFilename}`,
      });
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      user: {
        name,
        email,
      },
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Error in complex-upload:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
