import archiver from "archiver";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const outputPath = path.join(__dirname, "..", "no-fluff-reader.zip");

if (!fs.existsSync(distDir)) {
  console.error("dist/ directory not found. Run `pnpm build` first.");
  process.exit(1);
}

const output = fs.createWriteStream(outputPath);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  const size = (archive.pointer() / 1024).toFixed(1);
  console.log(`\nCreated no-fluff-reader.zip (${size} KB)\n`);
  console.log("Load unpacked from dist/ in chrome://extensions/ during development.");
  console.log("Submit the zip to the Chrome Web Store for publication.");
});

output.on("close", () => {
  try {
    const targetDir = path.join(__dirname, "..", "landing", "public");
    if (fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      const dest = path.join(targetDir, path.basename(outputPath));
      fs.copyFileSync(outputPath, dest);
      console.log(`Copied ${path.basename(outputPath)} to ${dest}`);
    } else {
      console.log("landing/public not found; skipping copy of zip.");
    }
  } catch (err) {
    console.warn("Failed to copy zip to landing/public:", err && err.message);
  }
});

archive.on("error", (err) => { throw err; });

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();
