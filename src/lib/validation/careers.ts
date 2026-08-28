export const CAREER_AREAS = [
  "Construction",
  "Welding & Fabrication",
  "Machine Operation",
  "Painting & Coatings",
  "General Application",
] as const;

export const PREFERRED_CONTACT_METHODS = ["Phone call", "Text message", "Email"] as const;
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export const RESUME_MIME_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

export type CareerArea = (typeof CAREER_AREAS)[number];
export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number];

export type ApplicationInput = {
  fullName: string;
  phone: string;
  email: string;
  careerArea: CareerArea;
  relevantExperience: string;
  preferredContactMethod: PreferredContactMethod;
  bestTimeToContact: string;
  optionalMessage: string | null;
};

export type ValidatedResume = {
  file: File;
  originalFilename: string;
  sanitizedFilename: string;
  mimeType: (typeof RESUME_MIME_TYPES)[keyof typeof RESUME_MIME_TYPES];
  sizeBytes: number;
  bytes: Uint8Array;
};

export type ApplicationField =
  | "name"
  | "phone"
  | "email"
  | "area"
  | "experience"
  | "contact"
  | "time"
  | "note"
  | "resume";

export type ApplicationFieldErrors = Partial<Record<ApplicationField, string>>;

export type ApplicationValidationResult =
  | { success: true; input: ApplicationInput; resume: ValidatedResume | null; jobPostingId: string | null }
  | { success: false; errors: ApplicationFieldErrors };

const LIMITS = {
  name: 120,
  phone: 50,
  email: 254,
  experience: 5000,
  time: 120,
  note: 5000,
} as const;

function normalizeSingleLine(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function normalizeMultiline(value: FormDataEntryValue | null) {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").split("\n").map((line) => line.trimEnd()).join("\n").trim()
    : "";
}

function isCareerArea(value: string): value is CareerArea {
  return CAREER_AREAS.some((area) => area === value);
}

function isPreferredContactMethod(value: string): value is PreferredContactMethod {
  return PREFERRED_CONTACT_METHODS.some((method) => method === value);
}

export function sanitizeFilename(filename: string) {
  const normalized = filename.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const extension = normalized.toLowerCase().endsWith(".docx") ? ".docx" : ".pdf";
  const base = normalized
    .slice(0, -extension.length)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, 100);
  return `${base || "resume"}${extension}`;
}

function extensionFor(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  return null;
}

function hasPdfSignature(bytes: Uint8Array) {
  return bytes.length >= 5 && new TextDecoder("ascii").decode(bytes.subarray(0, 5)) === "%PDF-";
}

function hasDocxSignature(bytes: Uint8Array) {
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) return false;
  const searchable = new TextDecoder("latin1").decode(bytes);
  return searchable.includes("[Content_Types].xml") && searchable.includes("word/document.xml");
}

async function validateResume(file: File): Promise<{ resume: ValidatedResume | null; error?: string }> {
  if (!file.name && file.size === 0) return { resume: null };
  if (file.size < 1) return { resume: null, error: "The selected resume is empty." };
  if (file.size > MAX_RESUME_BYTES) return { resume: null, error: "Resume files must be 5 MB or smaller." };

  const extension = extensionFor(file.name);
  if (!extension) return { resume: null, error: "Upload a PDF or DOCX resume." };

  const expectedMime = RESUME_MIME_TYPES[extension];
  const reportedMime = file.type.toLowerCase();
  const inconclusiveMime = !reportedMime || reportedMime === "application/octet-stream";
  if (!inconclusiveMime && reportedMime !== expectedMime) {
    return { resume: null, error: "The resume file type does not match its filename." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const signatureIsValid = extension === "pdf" ? hasPdfSignature(bytes) : hasDocxSignature(bytes);
  if (!signatureIsValid) {
    return { resume: null, error: "The selected file is not a valid PDF or DOCX resume." };
  }

  return {
    resume: {
      file,
      originalFilename: file.name,
      sanitizedFilename: sanitizeFilename(file.name),
      mimeType: expectedMime,
      sizeBytes: file.size,
      bytes,
    },
  };
}

export async function validateApplicationForm(formData: FormData): Promise<ApplicationValidationResult> {
  const values = {
    name: normalizeSingleLine(formData.get("name")),
    phone: normalizeSingleLine(formData.get("phone")),
    email: normalizeSingleLine(formData.get("email")).toLowerCase(),
    area: normalizeSingleLine(formData.get("area")),
    experience: normalizeMultiline(formData.get("experience")),
    contact: normalizeSingleLine(formData.get("contact")),
    time: normalizeSingleLine(formData.get("time")),
    note: normalizeMultiline(formData.get("note")),
  };

  const errors: ApplicationFieldErrors = {};
  if (!values.name) errors.name = "Enter your full name.";
  else if (values.name.length > LIMITS.name) errors.name = "Full name is too long.";
  if (!values.phone) errors.phone = "Enter your phone number.";
  else if (values.phone.length > LIMITS.phone) errors.phone = "Phone number is too long.";
  if (!values.email) errors.email = "Enter your email address.";
  else if (values.email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!isCareerArea(values.area)) errors.area = "Select a valid career area.";
  if (!values.experience) errors.experience = "Describe your relevant experience.";
  else if (values.experience.length > LIMITS.experience) errors.experience = "Relevant experience is too long.";
  if (!isPreferredContactMethod(values.contact)) errors.contact = "Select a valid contact method.";
  if (!values.time) errors.time = "Tell us the best time to contact you.";
  else if (values.time.length > LIMITS.time) errors.time = "Best contact time is too long.";
  if (values.note.length > LIMITS.note) errors.note = "Optional message is too long.";

  const resumeEntry = formData.get("resume");
  const resumeResult = resumeEntry instanceof File ? await validateResume(resumeEntry) : { resume: null };
  if (resumeResult.error) errors.resume = resumeResult.error;

  if (Object.keys(errors).length || !isCareerArea(values.area) || !isPreferredContactMethod(values.contact)) {
    return { success: false, errors };
  }

  return {
    success: true,
    input: {
      fullName: values.name,
      phone: values.phone,
      email: values.email,
      careerArea: values.area,
      relevantExperience: values.experience,
      preferredContactMethod: values.contact,
      bestTimeToContact: values.time,
      optionalMessage: values.note || null,
    },
    resume: resumeResult.resume,
    jobPostingId: (() => {
      const value = normalizeSingleLine(formData.get("jobPostingId"));
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) ? value : null;
    })(),
  };
}
