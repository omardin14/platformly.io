// Generates a 1024x1024 brand source PNG with a diagonal periwinkle->violet
// gradient on a dark field. Pure Node (zlib) — no native deps.
// Usage: node scripts/gen-placeholder-icon.mjs [outPath]
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const SIZE = 1024;
const out = process.argv[2] ?? "assets/icon-source.png";

// Brand colors.
const dark = [11, 13, 18]; // #0b0d12
const a = [141, 162, 251]; // periwinkle #8da2fb
const b = [196, 181, 253]; // violet #c4b5fd
const lerp = (x, y, t) => Math.round(x + (y - x) * t);

// Build raw RGBA scanlines (filter byte 0 per row).
const raw = Buffer.alloc(SIZE * (1 + SIZE * 4));
let p = 0;
const cx = SIZE / 2;
const cy = SIZE / 2;
const r = SIZE * 0.34;
for (let y = 0; y < SIZE; y++) {
  raw[p++] = 0; // no filter
  for (let x = 0; x < SIZE; x++) {
    // Rounded-square mask centered in the canvas.
    const dx = Math.max(Math.abs(x - cx) - r, 0);
    const dy = Math.max(Math.abs(y - cy) - r, 0);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = SIZE * 0.12;
    const inside = dist <= radius;
    if (inside) {
      const t = (x + y) / (2 * SIZE); // diagonal gradient
      raw[p++] = lerp(a[0], b[0], t);
      raw[p++] = lerp(a[1], b[1], t);
      raw[p++] = lerp(a[2], b[2], t);
      raw[p++] = 255;
    } else {
      raw[p++] = dark[0];
      raw[p++] = dark[1];
      raw[p++] = dark[2];
      raw[p++] = 255;
    }
  }
}

// CRC32 (PNG polynomial).
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
};

const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // RGBA
const png = Buffer.concat([
  sig,
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync(out, png);
console.log(`wrote ${out} (${SIZE}x${SIZE}, ${png.length} bytes)`);
