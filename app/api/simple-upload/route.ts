import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[] | null;

    if (!files) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "tmp", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = extname(file.name);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const path = join(uploadsDir, uniqueFilename);
      await writeFile(path, buffer);

      uploadedFiles.push({
        filename: uniqueFilename,
        size: file.size,
        path: `/uploads/${uniqueFilename}`,
      });
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Error in simple-upload:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
