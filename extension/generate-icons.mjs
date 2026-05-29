import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "public", "icons");

fs.mkdirSync(iconsDir, { recursive: true });

function generateSVG(size) {
  const r = size * 0.14;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#16161b"/>
      <stop offset="100%" style="stop-color:#0c0c0f"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <rect x="${size*0.1}" y="${size*0.1}" width="${size*0.8}" height="${size*0.8}" rx="${r*0.7}" fill="none" stroke="#2dd4bf" stroke-width="${size*0.06}" stroke-opacity="0.3"/>
  <text x="${size/2}" y="${size*0.68}" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="${size*0.45}" font-weight="700" fill="#2dd4bf">N</text>
</svg>`;
}

for (const size of [16, 48, 128]) {
  const svgContent = generateSVG(size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.svg`), svgContent);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), svgContent);
  console.log(`Generated icon${size}.png`);
}

console.log("Icons generated in public/icons/");
