import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { addGarment } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const garmentName = formData.get("garmentName") as string | null;
        const garmentCategory = formData.get("garmentCategory") as string | null;
        const isGarment = formData.get("isGarment") === "true";

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");

        // Choose directory based on file type
        const uploadDir = isGarment 
            ? path.join(process.cwd(), "public", "garments")
            : path.join(process.cwd(), "public", "uploads");

        // Ensure directory exists
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const url = isGarment ? `/garments/${filename}` : `/uploads/${filename}`;

        // If it's a garment, save to database
        if (isGarment && garmentName && garmentCategory) {
            const garmentId = `custom-${Date.now()}`;
            await addGarment({
                id: garmentId,
                name: garmentName,
                category: garmentCategory as any,
                image: url,
                isCustom: true,
            });
        }

        return NextResponse.json({
            success: true,
            url
        });
    } catch (error) {
        console.error("Error saving file:", error);
        return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
    }
}
