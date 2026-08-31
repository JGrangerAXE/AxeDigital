"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import {
  CAREER_AREAS,
  MAX_RESUME_BYTES,
  PREFERRED_CONTACT_METHODS,
  RESUME_MIME_TYPES,
  type ApplicationFieldErrors,
} from "@/lib/validation/careers";
import { createSubmissionGate } from "@/lib/careers/submission-gate";
import type { JobApplicationContext } from "@/types/jobs";

const fields = "w-full border border-white/20 bg-[var(--background-deep)]/45 px-4 py-3 text-white placeholder:text-white/30 focus:border-[var(--accent)]";

type SubmissionResponse = {
  ok?: boolean;
  message?: string;
  fieldErrors?: ApplicationFieldErrors;
};

export function ApplicationForm({ jobContext = null }: { jobContext?: JobApplicationContext | null }) {
  const [errors, setErrors] = useState<ApplicationFieldErrors>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submissionGate = useRef(createSubmissionGate());

  function validateBrowserFields(form: HTMLFormElement) {
    const data = new FormData(form);
    const next: ApplicationFieldErrors = {};
    const required = ["name", "phone", "email", "area", "experience", "contact", "time"] as const;
    required.forEach((key) => {
      if (!String(data.get(key) ?? "").trim()) next[key] = "This field is required.";
    });
    const email = String(data.get("email") ?? "");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    const resume = data.get("resume");
    if (resume instanceof File && resume.size) {
      const allowedMimeTypes = Object.values(RESUME_MIME_TYPES);
      const lowerName = resume.name.toLowerCase();
      const allowedExtension = lowerName.endsWith(".pdf") || lowerName.endsWith(".docx");
      const inconclusiveMime = !resume.type || resume.type === "application/octet-stream";
      if (!allowedExtension || (!inconclusiveMime && !allowedMimeTypes.includes(resume.type as never))) {
        next.resume = "Upload a PDF or DOCX resume.";
      } else if (resume.size > MAX_RESUME_BYTES) {
        next.resume = "Resume files must be 5 MB or smaller.";
      }
    }
    return next;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submissionGate.current.tryStart()) return;

    const form = event.currentTarget;
    const nextErrors = validateBrowserFields(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      submissionGate.current.finish();
      setMessage("Please correct the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    let accepted = false;
    try {
      const response = await fetch("/api/careers/applications", {
        method: "POST",
        body: new FormData(form),
      });
      const result = await response.json().catch(() => ({})) as SubmissionResponse;
      if (!response.ok || !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setMessage(result.message || "We could not submit your application. Please try again.");
        return;
      }
      accepted = true;
      setSubmitted(true);
    } catch {
      setMessage("We could not submit your application. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
      if (!accepted) submissionGate.current.finish();
    }
  }

  const error = (key: keyof ApplicationFieldErrors) => errors[key]
    ? <p id={`${key}-error`} className="mt-2 text-sm text-red-300">{errors[key]}</p>
    : null;

  if (submitted) {
    return (
      <section className="industrial-panel mt-10 p-7 sm:p-10" aria-labelledby="application-received-title" role="status">
        <p className="eyebrow">Application received</p>
        <h3 id="application-received-title" className="display mt-5 text-5xl sm:text-6xl">Thank You For Your Interest.</h3>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
          Thank you for your interest in Axe Build. We’ve received your information and will review it promptly. If we’d like to move forward, we’ll be in touch about next steps.
        </p>
        <div className="mt-9 border-l-2 border-[var(--accent)] pl-6">
          <h4 className="text-sm font-black uppercase tracking-[.14em] text-[var(--accent)]">What to expect</h4>
          <div className="mt-4 max-w-3xl space-y-4 leading-7 text-white/65">
            <p>If we decide to move forward, our typical hiring process includes two interviews followed by an offer letter.</p>
            <p>After an offer is accepted, there will be a minimum of one week before your start date.</p>
            <p>All employees are required to complete a pre-employment drug screen during that period before beginning work.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={submit} noValidate encType="multipart/form-data" className="industrial-panel mt-10 grid gap-6 p-6 sm:grid-cols-2 sm:p-9">
      {jobContext ? (
        <div className="border-l-2 border-[var(--accent)] bg-white/5 p-5 sm:col-span-2">
          <p className="text-xs font-black uppercase tracking-[.14em] text-[var(--accent)]">Applying for</p>
          <p className="mt-2 text-xl font-black uppercase">{jobContext.title}</p>
          <input type="hidden" name="jobPostingId" value={jobContext.id} />
        </div>
      ) : null}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-bold">Full name *</label>
        <input id="name" name="name" autoComplete="name" className={fields} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        {error("name")}
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-bold">Phone *</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={fields} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
        {error("phone")}
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-bold">Email *</label>
        <input id="email" name="email" type="email" autoComplete="email" className={fields} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        {error("email")}
      </div>
      <div>
        <label htmlFor="area" className="mb-2 block text-sm font-bold">Career area of interest *</label>
        <select id="area" name="area" defaultValue="" className={fields} aria-invalid={!!errors.area} aria-describedby={errors.area ? "area-error" : undefined}>
          <option value="" disabled>Select an area</option>
          {CAREER_AREAS.map((area) => <option key={area} value={area}>{area}</option>)}
        </select>
        {error("area")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="experience" className="mb-2 block text-sm font-bold">Relevant experience *</label>
        <textarea id="experience" name="experience" rows={4} className={fields} placeholder="Tell us about school, work, projects, equipment, or hands-on experience." aria-invalid={!!errors.experience} aria-describedby={errors.experience ? "experience-error" : undefined} />
        {error("experience")}
      </div>
      <div>
        <label htmlFor="contact" className="mb-2 block text-sm font-bold">Preferred contact method *</label>
        <select id="contact" name="contact" defaultValue="" className={fields} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "contact-error" : undefined}>
          <option value="" disabled>Select one</option>
          {PREFERRED_CONTACT_METHODS.map((method) => <option key={method} value={method}>{method}</option>)}
        </select>
        {error("contact")}
      </div>
      <div>
        <label htmlFor="time" className="mb-2 block text-sm font-bold">Best time to contact *</label>
        <input id="time" name="time" className={fields} placeholder="Example: Weekdays after 4 PM" aria-invalid={!!errors.time} aria-describedby={errors.time ? "time-error" : undefined} />
        {error("time")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="note" className="mb-2 block text-sm font-bold">Optional message</label>
        <textarea id="note" name="note" rows={4} className={fields} aria-invalid={!!errors.note} aria-describedby={errors.note ? "note-error" : undefined} />
        {error("note")}
      </div>
      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-bold" htmlFor="resume">Resume (optional)</label>
        <input id="resume" name="resume" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="w-full border border-dashed border-white/20 p-4 text-sm text-white/65" aria-invalid={!!errors.resume} aria-describedby={errors.resume ? "resume-error resume-note" : "resume-note"} />
        <p id="resume-note" className="mt-2 text-xs text-white/45">PDF or DOCX, up to 5 MB.</p>
        {error("resume")}
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={submitting} className="min-h-13 w-full bg-[var(--accent)] px-6 py-4 text-sm font-black uppercase tracking-[.12em] text-[var(--background-deep)] hover:bg-white disabled:cursor-wait disabled:opacity-65 sm:w-auto">
          {submitting ? "Submitting application…" : "Submit application"}
        </button>
        {message ? <p className="mt-4 text-sm leading-6 text-red-300" role="alert">{message}</p> : null}
        <p className="mt-4 max-w-3xl text-xs leading-5 text-white/45">
          Axe Build uses the information you submit for recruiting and hiring purposes. Review our <Link href="/privacy" className="text-white underline decoration-[var(--accent)] underline-offset-4">Privacy Information</Link> for details.
        </p>
      </div>
    </form>
  );
}
