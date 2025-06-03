import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs/promises";
import * as path from "path";
import { FileStorage } from "./file-storage.interface";
import { FileNode } from "./types";

@Injectable()
export class LocalStorageService implements FileStorage {
  private storagePath: string;

  constructor(private configService: ConfigService) {
    this.storagePath = this.configService.get<string>("STORAGE_PATH") as string;
  }

  async getDirectoryStructure(relativePath: string = ""): Promise<FileNode[]> {
    try {
      const fullPath = path.join(this.storagePath, relativePath);
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      const structure: FileNode[] = [];

      for (const entry of entries) {
        const entryPath = path.join(relativePath, entry.name);

        if (entry.isDirectory()) {
          const children = await this.getDirectoryStructure(entryPath);
          structure.push({
            name: entry.name,
            type: "directory",
            path: entryPath,
            children,
          });
        } else if (
          entry.isFile() &&
          (entry.name.endsWith(".md") || entry.name.endsWith(".tex"))
        ) {
          structure.push({
            name: entry.name,
            type: "file",
            path: entryPath,
          });
        }
      }

      return structure;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to read directory structure: ${errorMessage}`);
    }
  }

  async getFileContent(filePath: string): Promise<string> {
    try {
      // Ensure the path starts with a module directory
      if (!filePath.includes("/")) {
        throw new Error("File path must include a module directory");
      }
      const fullPath = path.join(this.storagePath, filePath);
      return await fs.readFile(fullPath, "utf-8");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to read file content: ${errorMessage}`);
    }
  }

  async getFileMetadata(filePath: string) {
    try {
      // Ensure the path starts with a module directory
      if (!filePath.includes("/")) {
        throw new Error("File path must include a module directory");
      }
      const fullPath = path.join(this.storagePath, filePath);
      const stats = await fs.stat(fullPath);
      return {
        filename: path.basename(filePath),
        size: stats.size,
        lastModified: stats.mtime,
        created: stats.birthtime,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get file metadata: ${errorMessage}`);
    }
  }
}
