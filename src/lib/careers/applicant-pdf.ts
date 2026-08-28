import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, type PDFFont, type PDFPage, rgb } from "pdf-lib";
import type { ApplicationInput, ValidatedResume } from "@/lib/validation/careers";

type ApplicantPdfInput = {
  applicationId: string;
  submittedAt: string;
  input: ApplicationInput;
  resume: ValidatedResume | null;
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const ORANGE = rgb(170 / 255, 97 / 255, 39 / 255);
const CHARCOAL = rgb(51 / 255, 51 / 255, 51 / 255);
const MUTED = rgb(105 / 255, 105 / 255, 105 / 255);

function safePdfFilenameName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "Applicant";
}

function splitLongToken(token: string, font: PDFFont, size: number, maxWidth: number) {
  const pieces: string[] = [];
  let current = "";
  for (const character of token) {
    const candidate = `${current}${character}`;
    if (current && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      pieces.push(current);
      current = character;
    } else {
      current = candidate;
    }
  }
  if (current) pieces.push(current);
  return pieces;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    const tokens = paragraph.split(/\s+/).flatMap((token) =>
      font.widthOfTextAtSize(token, size) > maxWidth
        ? splitLongToken(token, font, size, maxWidth)
        : [token],
    );
    let line = "";
    for (const token of tokens) {
      const candidate = line ? `${line} ${token}` : token;
      if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
        lines.push(line);
        line = token;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

export async function generateApplicantSummaryPdf({
  applicationId,
  submittedAt,
  input,
  resume,
}: ApplicantPdfInput) {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const fontBytes = await readFile(path.join(process.cwd(), "public", "fonts", "Geist-Regular.ttf"));
  const font = await document.embedFont(fontBytes, { subset: true });
  document.setTitle(`Axe Build Employment Application — ${input.fullName}`);
  document.setAuthor("Axe Build, LLC");
  document.setSubject("Employment application applicant summary");
  document.setCreator("Axe Digital employment application workflow");

  let page: PDFPage;
  let y: number;

  const addPage = () => {
    page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 18, width: PAGE_WIDTH, height: 18, color: ORANGE });
    page.drawText("AXE BUILD, LLC", { x: MARGIN, y: PAGE_HEIGHT - 50, size: 10, font, color: ORANGE });
    page.drawText("EMPLOYMENT APPLICATION", { x: MARGIN, y: PAGE_HEIGHT - 78, size: 21, font, color: CHARCOAL });
    page.drawText("Applicant Summary", { x: MARGIN, y: PAGE_HEIGHT - 98, size: 11, font, color: MUTED });
    y = PAGE_HEIGHT - 132;
  };

  const ensureSpace = (height: number) => {
    if (y - height < MARGIN) addPage();
  };

  const drawSection = (title: string) => {
    ensureSpace(40);
    y -= 12;
    page.drawRectangle({ x: MARGIN, y: y - 3, width: 22, height: 2, color: ORANGE });
    page.drawText(title, { x: MARGIN + 30, y: y - 7, size: 10, font, color: CHARCOAL });
    y -= 28;
  };

  const drawField = (label: string, value: string) => {
    const size = 10;
    const lineHeight = 15;
    const lines = wrapText(value, font, size, CONTENT_WIDTH);
    ensureSpace(18 + Math.max(1, lines.length) * lineHeight);
    page.drawText(label.toUpperCase(), { x: MARGIN, y, size: 7.5, font, color: MUTED });
    y -= 15;
    for (const line of lines.length ? lines : [""]) {
      page.drawText(line, { x: MARGIN, y, size, font, color: CHARCOAL });
      y -= lineHeight;
    }
    y -= 8;
  };

  addPage();
  drawField("Application ID", applicationId);
  drawField("Submitted", new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Denver",
  }).format(new Date(submittedAt)));

  drawSection("APPLICANT");
  drawField("Full Name", input.fullName);
  drawField("Career Area", input.careerArea);

  drawSection("CONTACT");
  drawField("Phone", input.phone);
  drawField("Email", input.email);
  drawField("Preferred Contact Method", input.preferredContactMethod);
  drawField("Best Time to Contact", input.bestTimeToContact);

  drawSection("RELEVANT EXPERIENCE");
  drawField("Submitted response", input.relevantExperience);

  drawSection("ADDITIONAL MESSAGE");
  drawField("Submitted response", input.optionalMessage || "None provided.");

  drawSection("RESUME");
  drawField(
    "Resume status",
    resume ? `Resume supplied separately: ${resume.originalFilename}` : "No resume provided.",
  );

  for (const currentPage of document.getPages()) {
    currentPage.drawText(`Application ${applicationId.slice(0, 8)}`, {
      x: MARGIN,
      y: 28,
      size: 7.5,
      font,
      color: MUTED,
    });
  }

  const bytes = await document.save();
  return {
    bytes,
    filename: `Axe_Applicant_${safePdfFilenameName(input.fullName)}_${applicationId.slice(0, 8)}.pdf`,
  };
}
