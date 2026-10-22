// Run once from the project root:
//   npm i -D sharp
//   node make-hero-sizes.mjs
import fs from "node:fs";
import sharp from "sharp";

const NAMES = [
  "background",
  "background-photography",
  "background-about",
  "background-contact",
];
const WIDTHS = [720, 1080, 1600, 2048];

for (const name of NAMES) {
  const input = `public/images/${name}.webp`;
  if (!fs.existsSync(input)) {
    console.log(`skipped ${name}: ${input} not found`);
    continue;
  }
  for (const w of WIDTHS) {
    const output = `public/images/${name}-${w}.webp`;
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true }) // never upscale a small original
      .webp({ quality: 72 })
      .toFile(output);
    console.log(`wrote ${output}`);
  }
}
