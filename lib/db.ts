import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export interface Garment {
  id: string;
  name: string;
  category: "shirts" | "pants" | "shoes" | "jackets";
  image: string;
  isCustom?: boolean;
}

const DB_PATH = path.join(process.cwd(), "data", "garments.txt");
const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DB_PATH)) {
    await writeFile(DB_PATH, "");
  }
}

// Read all garments from the database
export async function getAllGarments(): Promise<Garment[]> {
  try {
    await ensureDataDir();
    const content = await readFile(DB_PATH, "utf-8");
    if (!content.trim()) return [];
    
    return content
      .split("\n")
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  } catch (error) {
    console.error("Error reading garments:", error);
    return [];
  }
}

// Add a new garment to the database
export async function addGarment(garment: Garment): Promise<void> {
  try {
    await ensureDataDir();
    const line = JSON.stringify(garment) + "\n";
    await writeFile(DB_PATH, line, { flag: "a" });
  } catch (error) {
    console.error("Error adding garment:", error);
    throw error;
  }
}

// Delete a garment from the database
export async function deleteGarment(id: string): Promise<void> {
  try {
    await ensureDataDir();
    const garments = await getAllGarments();
    const filtered = garments.filter(g => g.id !== id);
    
    const content = filtered.map(g => JSON.stringify(g)).join("\n") + (filtered.length > 0 ? "\n" : "");
    await writeFile(DB_PATH, content);
  } catch (error) {
    console.error("Error deleting garment:", error);
    throw error;
  }
}

// Get garments by category
export async function getGarmentsByCategory(category: string): Promise<Garment[]> {
  const garments = await getAllGarments();
  return garments.filter(g => g.category === category);
}
