"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import matter from "gray-matter";

const pagesDirectory = path.join(process.cwd(), "content/pages");

export async function savePageAction(slug: string, content: string) {
  try {
    const filePath = path.join(pagesDirectory, `${slug}.md`);
    
    if (!filePath.startsWith(pagesDirectory)) {
      throw new Error("Invalid file path");
    }

    fs.writeFileSync(filePath, content, "utf8");
    
    revalidatePath(`/${slug}`);
    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save page:", error);
    return { success: false, error: "Failed to save changes" };
  }
}

export async function createPageAction(title: string, slug: string) {
  try {
    const filePath = path.join(pagesDirectory, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      return { success: false, error: "A page with this slug already exists" };
    }

    const initialContent = `---
title: "${title}"
order: 99
disabled: false
---

# ${title}

Empty page content...
`;

    fs.writeFileSync(filePath, initialContent, "utf8");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create page" };
  }
}

export async function deletePageAction(slug: string) {
  try {
    const filePath = path.join(pagesDirectory, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete page" };
  }
}

export async function togglePageDisabledAction(slug: string, disabled: boolean) {
  try {
    const filePath = path.join(pagesDirectory, `${slug}.md`);
    if (!fs.existsSync(filePath)) return { success: false, error: "Page not found" };

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    
    const newContent = matter.stringify(content, { ...data, disabled });
    fs.writeFileSync(filePath, newContent, "utf8");
    
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/${slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function updateOrderAction(slug: string, order: number) {
  try {
    const filePath = path.join(pagesDirectory, `${slug}.md`);
    if (!fs.existsSync(filePath)) return { success: false, error: "Page not found" };

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    
    const newContent = matter.stringify(content, { ...data, order });
    fs.writeFileSync(filePath, newContent, "utf8");
    
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update order" };
  }
}

export async function uploadImageAction(formData: FormData, subPath: string = "") {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const baseDir = path.join(process.cwd(), "public/images");
    const uploadDir = path.join(baseDir, subPath);
    
    // Security check: ensure uploadDir is within baseDir
    if (!uploadDir.startsWith(baseDir)) {
      return { success: false, error: "Invalid path" };
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, buffer);

    revalidatePath("/admin");
    return { success: true, url: `/images/${subPath ? subPath + '/' : ''}${fileName}` };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Upload failed" };
  }
}

export async function getMediaAction(subPath: string = "") {
  try {
    const baseDir = path.join(process.cwd(), "public/images");
    const targetDir = path.join(baseDir, subPath);

    if (!targetDir.startsWith(baseDir)) {
      return { success: false, error: "Invalid path" };
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const entries = fs.readdirSync(targetDir, { withFileTypes: true });

    const items = entries.map(entry => {
      const entryRelativePath = path.join(subPath, entry.name).replace(/\\/g, '/');
      return {
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
        url: entry.isDirectory() ? null : `/images/${entryRelativePath}`,
        path: entryRelativePath
      };
    }).filter(item => {
      if (item.type === 'directory') return true;
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name);
    });

    return { 
      success: true, 
      items: items.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      })
    };
  } catch (error) {
    return { success: false, error: "Failed to list media" };
  }
}

export async function deleteMediaAction(relativePath: string) {
  try {
    const baseDir = path.join(process.cwd(), "public/images");
    const targetPath = path.join(baseDir, relativePath);

    if (!targetPath.startsWith(baseDir) || targetPath === baseDir) {
      return { success: false, error: "Invalid path" };
    }

    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);
      if (stats.isDirectory()) {
        fs.rmSync(targetPath, { recursive: true });
      } else {
        fs.unlinkSync(targetPath);
      }
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete item" };
  }
}

export async function createFolderAction(parentPath: string, name: string) {
  try {
    const baseDir = path.join(process.cwd(), "public/images");
    const newDirPath = path.join(baseDir, parentPath, name);

    if (!newDirPath.startsWith(baseDir)) {
      return { success: false, error: "Invalid path" };
    }

    if (!fs.existsSync(newDirPath)) {
      fs.mkdirSync(newDirPath, { recursive: true });
    } else {
      return { success: false, error: "Folder already exists" };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create folder" };
  }
}
