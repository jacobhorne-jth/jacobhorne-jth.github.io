import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const sourcePath = resolve("resume.txt");
const outputPath = resolve("public/resume.pdf");

const page = { width: 612, height: 792 };
const marginX = 34;
const topY = 762;
const bodySize = 7.2;
const lineHeight = 9.4;

const escapePdf = value =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const textWidth = (value, size) => value.length * size * 0.6;

const lines = readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n").split("\n");

const content = [];
let y = topY;

const writeText = (text, x, yPos, size = bodySize, font = "F1") => {
  content.push(`BT /${font} ${size} Tf ${x.toFixed(2)} ${yPos.toFixed(2)} Td (${escapePdf(text)}) Tj ET`);
};

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];

  if (i === 0) {
    const size = 15;
    writeText(line, (page.width - textWidth(line, size)) / 2, y, size, "F2");
    y -= 12;
    continue;
  }

  if (i === 1) {
    const size = 6.6;
    writeText(line, (page.width - textWidth(line, size)) / 2, y, size);
    y -= 13;
    continue;
  }

  if (!line.trim()) {
    y -= 3.5;
    continue;
  }

  const isSection = line === line.toUpperCase() && /^[A-Z/ ]+$/.test(line);
  if (isSection) {
    y -= 2.5;
    content.push(`0.5 w ${marginX} ${(y - 2).toFixed(2)} m ${(page.width - marginX).toFixed(2)} ${(y - 2).toFixed(2)} l S`);
    writeText(line, marginX, y, 8.2, "F2");
    y -= 10.2;
    continue;
  }

  const isTopLine = /^[A-Za-z0-9]/.test(line) && !line.startsWith("Languages:") && !line.startsWith("ML/Data:") && !line.startsWith("Platforms/Tools:");
  writeText(line, marginX, y, bodySize, isTopLine ? "F2" : "F1");
  y -= lineHeight;
}

const stream = `${content.join("\n")}\n`;

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>",
  `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}endstream`,
];

let pdf = "%PDF-1.4\n";
const offsets = [0];

objects.forEach((object, index) => {
  offsets.push(Buffer.byteLength(pdf, "utf8"));
  pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf, "utf8");
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += "0000000000 65535 f \n";
for (let i = 1; i < offsets.length; i += 1) {
  pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, pdf, "utf8");
