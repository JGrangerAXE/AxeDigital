"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import type { JobContent, JobPosting, JobTemplate } from "@/types/jobs";

const input = "w-full border border-white/20 bg-black/35 px-4 py-3 text-white focus:border-[var(--accent)]";
const empty: JobContent = { jobTitle: "", jobDescription: "", jobDuties: "", experienceRequired: "", schedule: "", location: "", payRange: null };
type Editor = { kind: "posting"; id?: string; content: JobContent; currentStatus?: JobPosting["status"] } | { kind: "template"; id?: string; templateName: string; content: JobContent };

export function CareersAdmin() {
  const [session, setSession] = useState<Session | null>(null), [email, setEmail] = useState(""), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  const [postings, setPostings] = useState<JobPosting[]>([]), [templates, setTemplates] = useState<JobTemplate[]>([]), [editor, setEditor] = useState<Editor | null>(null);

  async function api(body?: Record<string, unknown>, activeSession = session) {
    if (!activeSession) throw new Error("Sign in is required.");
    const response = await fetch("/api/admin/careers", { method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${activeSession.access_token}`, ...(body ? { "Content-Type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Request failed.");
    setPostings(result.postings); setTemplates(result.templates);
  }

  useEffect(() => {
    let subscription: { unsubscribe(): void } | undefined;
    try {
      const client = getBrowserSupabaseClient();
      client.auth.getSession().then(({ data }) => { setSession(data.session); if (data.session) api(undefined, data.session).catch((error) => setMessage(error.message)); });
      subscription = client.auth.onAuthStateChange((_event, next) => { setSession(next); if (next) api(undefined, next).catch((error) => setMessage(error.message)); }).data.subscription;
    } catch { queueMicrotask(() => setMessage("Supabase browser configuration is missing.")); }
    return () => subscription?.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function requestLink(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const client = getBrowserSupabaseClient();
      const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin/careers` } });
      if (error) throw error; setMessage("Check your email for the secure sign-in link.");
    } catch { setMessage("A sign-in link could not be sent. Confirm the address and try again."); } finally { setBusy(false); }
  }

  async function action(body: Record<string, unknown>) {
    setBusy(true); setMessage("");
    try { await api(body); setEditor(null); setMessage("Changes saved."); } catch (error) { setMessage(error instanceof Error ? error.message : "Request failed."); } finally { setBusy(false); }
  }

  async function downloadPdf(posting: JobPosting) {
    if (!session) return; setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/careers/postings/${posting.id}/pdf`, { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!response.ok) throw new Error("PDF download failed.");
      const url = URL.createObjectURL(await response.blob()), anchor = document.createElement("a"); anchor.href = url; anchor.download = `Axe_Job_${posting.jobTitle.replace(/[^a-z0-9]+/gi, "_")}.pdf`; anchor.click(); URL.revokeObjectURL(url);
    } catch (error) { setMessage(error instanceof Error ? error.message : "PDF download failed."); } finally { setBusy(false); }
  }

  if (!session) return <div className="container-shell max-w-xl"><p className="eyebrow">Careers administration</p><h1 className="display mt-5 text-5xl">Secure Sign In.</h1><p className="mt-5 leading-7 text-white/60">Approved Axe administrators can request a one-time sign-in link.</p><form onSubmit={requestLink} className="industrial-panel mt-8 p-6"><label htmlFor="admin-email" className="mb-2 block font-bold">Work email</label><input id="admin-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={input} /><button disabled={busy} className="mt-5 bg-[var(--accent)] px-5 py-3 font-black uppercase text-black disabled:opacity-50">{busy ? "Sending…" : "Email Sign-In Link"}</button>{message ? <p role="status" className="mt-4 text-sm text-white/65">{message}</p> : null}</form></div>;

  const open = postings.filter((item) => item.status === "open"), history = postings.filter((item) => item.status !== "open");
  return <div className="container-shell"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Careers administration</p><h1 className="display mt-5 text-5xl sm:text-7xl">Manage Opportunities.</h1></div><button onClick={() => getBrowserSupabaseClient().auth.signOut()} className="border border-white/25 px-4 py-3 text-xs font-black uppercase">Sign Out</button></div>
    {message ? <p role="status" className="mt-6 border-l-2 border-[var(--accent)] pl-4 text-sm text-white/70">{message}</p> : null}
    {editor ? <JobEditor editor={editor} busy={busy} cancel={() => setEditor(null)} save={(status) => editor.kind === "template" ? action({ action: "saveTemplate", id: editor.id, templateName: editor.templateName, content: editor.content }) : action({ action: "savePosting", id: editor.id, content: editor.content, status })} update={setEditor} /> : null}
    {!editor ? <>
      <section className="mt-12"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-black uppercase">Open Postings</h2><button onClick={() => setEditor({ kind: "posting", content: { ...empty } })} className="bg-[var(--accent)] px-5 py-3 text-sm font-black uppercase text-black">+ New Job Posting</button></div><PostingList postings={open} edit={(item) => setEditor({ kind: "posting", id: item.id, content: item, currentStatus: item.status })} pdf={downloadPdf} transition={(id, status) => action({ action: "transitionPosting", id, status })} /></section>
      <section className="mt-12"><h2 className="text-2xl font-black uppercase">Posting History & Drafts</h2><PostingList postings={history} edit={(item) => setEditor({ kind: "posting", id: item.id, content: item, currentStatus: item.status })} pdf={downloadPdf} transition={(id, status) => action({ action: "transitionPosting", id, status })} /></section>
      <section className="mt-12"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-black uppercase">Templates</h2><button onClick={() => setEditor({ kind: "template", templateName: "", content: { ...empty } })} className="bg-[var(--accent)] px-5 py-3 text-sm font-black uppercase text-black">+ New Template</button></div><div className="mt-5 grid gap-3">{templates.length ? templates.map((item) => <article key={item.id} className="industrial-panel flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-black uppercase">{item.templateName}</p><p className="mt-1 text-sm text-white/55">{item.jobTitle}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setEditor({ kind: "template", id: item.id, templateName: item.templateName, content: item })} className="border border-white/25 px-3 py-2 text-xs font-black uppercase">Edit Template</button><button onClick={() => action({ action: "createPostingFromTemplate", templateId: item.id })} className="border border-[var(--accent)] px-3 py-2 text-xs font-black uppercase text-[var(--accent)]">Create Posting From Template</button></div></article>) : <Empty label="No templates yet." />}</div></section>
    </> : null}
  </div>;
}

function Empty({ label }: { label: string }) { return <div className="industrial-panel mt-5 p-6 text-white/55">{label}</div>; }
function PostingList({ postings, edit, pdf, transition }: { postings: JobPosting[]; edit(item: JobPosting): void; pdf(item: JobPosting): void; transition(id: string, status: "filled" | "closed" | "archived"): void }) {
  if (!postings.length) return <Empty label="No postings in this group." />;
  return <div className="mt-5 grid gap-3">{postings.map((item) => <article key={item.id} className="industrial-panel p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase text-[var(--accent)]">{item.status}</p><h3 className="mt-2 text-xl font-black uppercase">{item.jobTitle}</h3><p className="mt-1 text-sm text-white/55">{item.location}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => edit(item)} className="border border-white/25 px-3 py-2 text-xs font-black uppercase">Edit</button><button onClick={() => pdf(item)} className="border border-white/25 px-3 py-2 text-xs font-black uppercase">Download PDF</button>{item.status === "open" ? <><button onClick={() => transition(item.id, "filled")} className="border border-white/25 px-3 py-2 text-xs font-black uppercase">Mark Filled</button><button onClick={() => transition(item.id, "closed")} className="border border-white/25 px-3 py-2 text-xs font-black uppercase">Close</button></> : null}<button onClick={() => transition(item.id, "archived")} className="border border-white/15 px-3 py-2 text-xs font-black uppercase text-white/55">Archive</button></div></div></article>)}</div>;
}

function JobEditor({ editor, busy, cancel, save, update }: { editor: Editor; busy: boolean; cancel(): void; save(status?: "draft" | "open"): void; update(editor: Editor): void }) {
  const content = editor.content;
  const set = (field: keyof JobContent, value: string) => update({ ...editor, content: { ...content, [field]: field === "payRange" ? (value || null) : value } } as Editor);
  const fields: Array<[keyof JobContent, string, number]> = [["jobTitle", "Job Title", 1], ["jobDescription", "Job Description", 5], ["jobDuties", "Job Duties", 6], ["experienceRequired", "Experience Required", 5], ["schedule", "Schedule", 3], ["location", "Location", 2], ["payRange", "Pay Range (optional)", 2]];
  return <section className="industrial-panel mt-10 p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-black uppercase">{editor.id ? "Edit" : "New"} {editor.kind}</h2><button onClick={cancel} className="text-sm font-black uppercase text-white/60">Cancel</button></div><div className="mt-7 grid gap-5 sm:grid-cols-2">{editor.kind === "template" ? <div className="sm:col-span-2"><label className="mb-2 block font-bold">Template Name *</label><input value={editor.templateName} onChange={(event) => update({ ...editor, templateName: event.target.value })} className={input} /></div> : null}{fields.map(([field, label, rows]) => <div key={field} className={rows > 2 ? "sm:col-span-2" : ""}><label className="mb-2 block font-bold">{label}{field !== "payRange" ? " *" : ""}</label>{rows > 2 ? <textarea rows={rows} value={content[field] ?? ""} onChange={(event) => set(field, event.target.value)} className={input} /> : <input value={content[field] ?? ""} onChange={(event) => set(field, event.target.value)} className={input} />}</div>)}</div><div className="mt-7 flex flex-wrap gap-3">{editor.kind === "template" ? <button disabled={busy} onClick={() => save()} className="bg-[var(--accent)] px-5 py-3 font-black uppercase text-black disabled:opacity-50">Save Template</button> : <><button disabled={busy} onClick={() => save("draft")} className="border border-white/30 px-5 py-3 font-black uppercase disabled:opacity-50">Save Draft</button><button disabled={busy} onClick={() => save("open")} className="bg-[var(--accent)] px-5 py-3 font-black uppercase text-black disabled:opacity-50">Publish</button>{editor.id ? <button disabled={busy} onClick={() => save(editor.currentStatus === "open" ? "open" : "draft")} className="border border-white/30 px-5 py-3 font-black uppercase disabled:opacity-50">Save Changes</button> : null}</>}</div></section>;
}
