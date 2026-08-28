import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";
import { PDFDocument, type PDFFont, type PDFPage, rgb } from "pdf-lib";
import { publicSiteUrl } from "@/lib/validation/jobs";
import type { JobPosting } from "@/types/jobs";

const WIDTH = 612, HEIGHT = 792, MARGIN = 54, CONTENT = WIDTH - MARGIN * 2;
const ORANGE = rgb(170 / 255, 97 / 255, 39 / 255), CHARCOAL = rgb(51 / 255, 51 / 255, 51 / 255), MUTED = rgb(.42, .42, .42);

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (!paragraph) { lines.push(""); continue; }
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) { lines.push(line); line = word; } else line = candidate;
    }
    if (line) lines.push(line);
  }
  return lines;
}

function filename(title: string) { return `Axe_Job_${title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 70) || "Posting"}.pdf`; }

export function jobPostingPdfSections(posting: JobPosting) {
  return [
    ["JOB DESCRIPTION", posting.jobDescription], ["JOB DUTIES", posting.jobDuties],
    ["EXPERIENCE REQUIRED", posting.experienceRequired], ["SCHEDULE", posting.schedule], ["LOCATION", posting.location],
    ...(posting.payRange ? [["PAY RANGE", posting.payRange]] : []),
  ] as Array<[string, string]>;
}

export async function generateJobPostingPdf(posting: JobPosting, configuredSiteUrl?: string) {
  const site = publicSiteUrl(configuredSiteUrl), qrTarget = `${site}/careers`;
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const font = await document.embedFont(await readFile(path.join(process.cwd(), "public", "fonts", "Geist-Regular.ttf")), { subset: true });
  const qr = await document.embedPng(await QRCode.toBuffer(qrTarget, { type: "png", width: 210, margin: 3, errorCorrectionLevel: "M", color: { dark: "#151515", light: "#FFFFFF" } }));
  document.setTitle(`Axe Build Job Posting — ${posting.jobTitle}`); document.setAuthor("Axe Build, LLC"); document.setSubject("Employment opportunity");
  let page!: PDFPage, y = 0;
  const addPage = () => { page = document.addPage([WIDTH, HEIGHT]); page.drawRectangle({ x: 0, y: HEIGHT - 18, width: WIDTH, height: 18, color: ORANGE }); page.drawText("AXE BUILD, LLC", { x: MARGIN, y: HEIGHT - 50, size: 10, font, color: ORANGE }); y = HEIGHT - 78; };
  const ensure = (height: number) => { if (y - height < MARGIN) addPage(); };
  const lines = (text: string, size = 10.5) => { const wrapped = wrap(text, font, size, CONTENT); for (const line of wrapped) { ensure(16); page.drawText(line, { x: MARGIN, y, size, font, color: CHARCOAL }); y -= 15; } };
  const section = (title: string, text: string) => { ensure(52); y -= 14; page.drawRectangle({ x: MARGIN, y: y + 2, width: 22, height: 2, color: ORANGE }); page.drawText(title, { x: MARGIN + 30, y, size: 9, font, color: CHARCOAL }); y -= 24; lines(text); y -= 9; };
  addPage();
  lines(posting.jobTitle, 24); y -= 5; lines(posting.location, 11); if (posting.payRange) { y -= 2; lines(posting.payRange, 11); }
  for (const [title, text] of jobPostingPdfSections(posting)) section(title, text);
  ensure(145); y -= 15; page.drawRectangle({ x: MARGIN, y: y - 112, width: CONTENT, height: 122, color: rgb(.96, .96, .95) }); page.drawImage(qr, { x: MARGIN + 10, y: y - 102, width: 102, height: 102 }); page.drawText("APPLY ONLINE", { x: MARGIN + 130, y: y - 25, size: 13, font, color: CHARCOAL }); page.drawText("Scan to view current opportunities and apply.", { x: MARGIN + 130, y: y - 47, size: 9, font, color: MUTED }); page.drawText(qrTarget.replace(/^https?:\/\//, ""), { x: MARGIN + 130, y: y - 68, size: 9, font, color: ORANGE });
  const bytes = await document.save();
  return { bytes, filename: filename(posting.jobTitle), qrTarget };
}
