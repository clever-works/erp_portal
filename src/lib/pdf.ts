/**
 * Tiny dependency-free PDF writer (one A4 page, Helvetica, text + rectangles + lines).
 * Enough for payslips without adding an npm package. Coordinates are in points
 * from the TOP-left corner; text must be plain ASCII.
 */
type RGB = [number, number, number];
const PAGE_W = 595.28;
const PAGE_H = 841.89;

/* Helvetica advance widths (per 1000 units) for the characters payslips use. */
const WIDTHS: Record<string, number> = { " ": 278, ",": 278, ".": 278, "-": 333, ":": 278, "(": 333, ")": 333, "%": 889, "/": 278, "+": 584, "#": 556 };
function charWidth(ch: string, bold: boolean) {
  if (WIDTHS[ch] !== undefined) return WIDTHS[ch];
  if (/[0-9]/.test(ch)) return 556;
  if (/[A-Z]/.test(ch)) return bold ? 722 : 667;
  if (/[ilj]/.test(ch)) return 222;
  if (/[mw]/.test(ch)) return 833;
  return bold ? 611 : 556;
}

const hex = (color: string): RGB => { const v = color.replace("#", ""); return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255) as RGB; };
const rgb = (c: RGB) => c.map((n) => n.toFixed(3)).join(" ");
const escape = (text: string) => text.replace(/[^\x20-\x7e]/g, "-").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

export class SimplePdf {
  private ops: string[] = [];
  readonly width = PAGE_W;
  readonly height = PAGE_H;

  textWidth(text: string, size: number, bold = false) { return [...text].reduce((w, ch) => w + charWidth(ch, bold), 0) * size / 1000; }

  text(x: number, y: number, text: string, opts: { size?: number; bold?: boolean; color?: string; align?: "left" | "right" | "center" } = {}) {
    const { size = 10, bold = false, color = "#000000", align = "left" } = opts;
    const w = this.textWidth(text, size, bold);
    const left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    this.ops.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${rgb(hex(color))} rg ${left.toFixed(2)} ${(PAGE_H - y).toFixed(2)} Td (${escape(text)}) Tj ET`);
    return this;
  }

  rect(x: number, y: number, w: number, h: number, fill: string) {
    this.ops.push(`${rgb(hex(fill))} rg ${x.toFixed(2)} ${(PAGE_H - y - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
    return this;
  }

  line(x1: number, y1: number, x2: number, y2: number, color = "#cccccc", width = 0.6) {
    this.ops.push(`${rgb(hex(color))} RG ${width} w ${x1.toFixed(2)} ${(PAGE_H - y1).toFixed(2)} m ${x2.toFixed(2)} ${(PAGE_H - y2).toFixed(2)} l S`);
    return this;
  }

  toBlob() {
    const content = this.ops.join("\n");
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    ];
    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [];
    objects.forEach((body, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${body}\nendobj\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Blob([pdf], { type: "application/pdf" });
  }
}
