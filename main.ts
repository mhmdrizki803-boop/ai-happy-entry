import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1024 * 1024;
const repositoryDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repositoryDir, "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputPath = join(outputDir, "entry.png");

let sourceSize: number;
try {
  sourceSize = (await stat(sourcePath)).size;
} catch (cause) {
  throw new Error(`Required source image is missing or unreadable: ${sourcePath}`, { cause });
}

if (sourceSize > MAX_BYTES) {
  throw new Error(
    `Source image is too large: ${sourceSize} bytes; maximum is ${MAX_BYTES} bytes (1 MiB)`,
  );
}

const image = await readFile(sourcePath);
await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, image);
