# Axe Build Website — Post-Launch Polish and Growth Backlog

## Purpose

These items improve quality, conversion, maintainability, reach, recruiting effectiveness, or automation. They should not delay the Version 1 launch once the safety and credibility items in `docs/go-live-blockers.md` are resolved. The practical sequence is to launch a truthful static site with direct contact fallbacks, then add richer content and data collection deliberately.

## Priority Levels

### P1 — First Week

High-value improvements that should begin immediately after launch because they strengthen credibility, recruiting conversion, measurement, or operating reliability.

### P2 — First Month

Important content, technical, recruiting, marketing, and workflow improvements that benefit from stakeholder input or modest design/backend work.

### P3 — Future Phase

Larger systems, automation, CMS, advanced applicant tracking, and integrations that require product decisions, governance, or sustained implementation.

## P1 — First Week

| ID | Priority | Category | Current state | Improvement needed | Business value | Suggested owner | Dependencies | Estimated effort | Recommended sequence |
|---|---|---|---|---|---|---|---|---|---|
| PL-01 | P1 — First Week | Content and leadership approval | Home and Careers contain strong launch copy such as `BUILD SOMETHING REAL.`, `YOUR WORK SHOULD MEAN SOMETHING.`, and `More than a job`; the wording is spread through `src/app/page.tsx`, `src/app/careers/page.tsx`, and `src/components/layout/Footer.tsx`. | Finalize the headline, slogan, supporting headline, CTA language, and recruiting voice after observing leadership and candidate reactions. | Creates one repeatable brand message for web, recruiting, and social channels. | Owner / President, HR, Jacob | Version 1 message approved and live | 1 hour | Review live copy first; record one approved message guide before writing new pages. |
| PL-02 | P1 — First Week | Services and market positioning | `src/app/what-we-do/page.tsx` has broad categories but no approved service detail, market focus, geographic coverage, safety story, or differentiators; `docs/content-needed.md` lists these gaps. | Document concise public service descriptions, markets served, geographic coverage, construction/fabrication differentiation, and a factual safety summary. | Helps customers self-qualify and prevents Axe from looking fabrication-only or generic. | Owner / President, Construction, Fabrication, Safety | Capability categories approved at launch | 2–4 hours of stakeholder input; 2–4 hours implementation | Confirm services and geography, then add differentiators and safety—not equipment-detail copy first. |
| PL-03 | P1 — First Week | Careers content | `src/content/sample-jobs.ts` contains only development samples; `src/app/careers/page.tsx` intentionally leaves compensation, schedule, benefits, training, and advancement unconfirmed. | Prepare the first real openings with title, location, pay range where required or useful, benefits, shift, travel, physical requirements, qualifications, and application instructions. | Converts recruiting interest into qualified applicants and reduces repetitive HR questions. | HR with hiring managers | Approved active requisitions and employment/legal review | 2–4 hours per first job family | Publish one accurate opening before trying to support every trade at once. |
| PL-04 | P1 — First Week | Contact and quote conversion | `src/app/contact/page.tsx` currently contains one combined placeholder form; no quote-routing workflow exists. | Define separate minimum fields for general contact and quote requests, including project type, location, timing, attachment policy, routing, response expectations, and error/success behavior. | Gives customers a clear next step and improves lead quality. | Operations, IT / Susan, Jacob | Monitored inboxes and privacy language | 4–8 hours for a simple production form | Keep the direct phone/email fallback; implement general contact first, then quote-specific fields. |
| PL-05 | P1 — First Week | Media acquisition | Current media in `src/content/media.ts` is authentic but limited in finished projects, drone scale, employee-centered construction, and broad trade coverage; `docs/media-inventory.md` records the gaps. | Request drone footage, finished-project photography, employee-centered photography, construction action, and heavy-equipment footage. | Makes the construction-first story more credible and gives leadership visible reasons to keep investing in the site. | Construction, Marketing / Jacob | Customer/site permission and employee likeness approval | 1–2 shoot days plus selection | Capture finished construction and people first; then equipment and supporting shop details. |
| PL-06 | P1 — First Week | Media governance | `docs/content-needed.md` calls for employee likeness and customer/site rules; no approval metadata is represented in `src/content/media.ts`. | Establish employee likeness policy, customer/project release process, asset approver, allowed channels, and a minimal media metadata sheet. | Prevents takedowns and makes approved assets reusable across web and social. | HR, Operations, Safety, Marketing / Jacob | Leadership policy decision | 2–4 hours | Create approval fields before the next large media import. |
| PL-07 | P1 — First Week | SEO and social previews | `src/app/layout.tsx` provides basic titles/descriptions and OpenGraph text, but there are no canonical URLs, OpenGraph image, route-specific social previews, favicon, `sitemap.ts`, or `robots.ts`; `/favicon.ico`, `/sitemap.xml`, and `/robots.txt` returned 404 in the audit. | Add final page titles/meta descriptions, canonical URLs, favicon, OpenGraph images, social preview metadata, sitemap, and explicit robots behavior. | Produces professional shares, prevents URL ambiguity, and lets search engines discover the site correctly. | Jacob, IT / Susan | Final domain and approved social image | 2–4 hours | Canonical/domain and robots first; favicon and OG image second; sitemap last. |
| PL-08 | P1 — First Week | Analytics and consent decision | No analytics package, tracking events, or consent UI exists in `package.json`, `src/app/layout.tsx`, or the repository. | Decide whether to install Vercel Analytics or an alternative; document whether consent is required for the selected tool and jurisdictions. | Establishes a lawful baseline for measuring leadership interest, recruiting traffic, and site reliability. | Owner / President, IT / Susan, Jacob | Privacy policy and tool decision | 1–2 hours | Decide measurement goals before installing a tool; keep analytics absent if consent/privacy cannot be resolved quickly. |
| PL-09 | P1 — First Week | Design, accessibility, and browser quality | Source includes labels, focus styles, skip link, reduced motion, and responsive layouts (`src/app/layout.tsx`, `src/app/globals.css`, `Header.tsx`); supporting routes render their primary title through the reusable `SectionHeading` as an `h2`, and there is no formal audit. | Make each route’s main title an `h1`; perform keyboard, screen-reader spot checks, contrast review, mobile crop review, and Chrome/Edge/Safari/Firefox testing. Refine logo treatment, typography, and section spacing only where testing finds issues. | Improves usability and reduces avoidable accessibility and cross-browser failures. | Jacob with an accessibility reviewer if available | Live production URL and target-device list | 4–8 hours | Semantic headings and keyboard flow first; then mobile crops, browser differences, and visual refinements. |
| PL-10 | P1 — First Week | Performance and operational monitoring | Images use Next.js Image and responsive sizes in `src/components/shared/AxeMedia.tsx`; committed photos total about 56.8 MB; source 4K videos are ignored by Git and unused. No error monitoring or post-launch performance baseline exists. | Measure Core Web Vitals, review generated image sizes, add lightweight error monitoring, and set a performance budget before adding video. | Protects the fast first impression and reveals production-only failures quickly. | Jacob, IT / Susan | Live traffic and deployment access | 2–4 hours | Capture baseline first; optimize the heaviest observed pages; add monitoring before new backend features. |

## P2 — First Month

| ID | Priority | Category | Current state | Improvement needed | Business value | Suggested owner | Dependencies | Estimated effort | Recommended sequence |
|---|---|---|---|---|---|---|---|---|---|
| PL-11 | P2 — First Month | Company narrative | `src/app/about/page.tsx` has only positioning and development notes. There is no approved company history, purpose statement, values, leadership bios, or operating story. | Publish an approved company description, purpose, values, history, leadership bios, and explanation of how field and shop teams work together. | Builds trust with candidates, customers, and partners without relying only on visuals. | Owner / President, leadership, Jacob | Leadership interviews and photo approval | 1–2 days | Company description and history first; values and bios after factual review. |
| PL-12 | P2 — First Month | Recruiting depth | Careers copy in `src/app/careers/page.tsx` is intentionally general and contains no verified testimonials or detailed progression. | Add approved training, advancement, hiring-process detail, realistic travel/physical expectations, and employee testimonials with written likeness/content approval. | Helps younger candidates understand the work and improves applicant fit. | HR, hiring managers, employees, Jacob | Actual programs/processes and employee consent | 1–2 days plus interviews | Operational facts first, then testimonials and richer storytelling. |
| PL-13 | P2 — First Month | Application workflow | `ApplicationForm.tsx` is browser-only; resume is disabled; no HR notification, confirmation email, applicant tracking, or application analytics exists. | Implement secure applications, private resume storage, HR notifications, applicant confirmation emails, status ownership, and start/completion analytics. | Makes recruiting actionable and reduces lost or duplicated applicant follow-up. | HR, IT / Susan, Jacob | Privacy/retention policy, storage decision, jobs data model | 3–7 days | Data policy and routing first; form/server flow second; resume and analytics third. |
| PL-14 | P2 — First Month | Supabase data model | `src/lib/supabase/*` contains unused client factories; `supabase/migrations/` is empty; `docs/architecture.md` proposes six future tables. | Design and review `job_openings`, `employment_applications`, `contact_submissions`, `quote_requests`, `media_submissions`, and `media_content_usage`; add migrations only for the first approved workflow. | Provides a maintainable foundation without connecting the website to Axe Operations or creating unused tables. | IT / Susan, Jacob, process owners | Data owner, retention, access, and workflow decisions | 2–5 days for first workflow | Start with job openings or contact submissions—not all six tables simultaneously. |
| PL-15 | P2 — First Month | Backend security | Architecture notes call for server handlers, but there is no server-side validation, RLS, spam protection, rate limiting, file validation, audit logging, or retention enforcement. | Add route/server-action validation, least-privilege RLS, bot controls, rate limits, safe errors, private storage, file checks, and deletion schedules. | Prevents abuse, leaked applicant/customer data, and unsafe public writes. | IT / Susan, Jacob, legal/HR for retention | PL-14 schema and chosen form workflows | 3–7 days | Threat model and retention first; RLS/server validation second; abuse/file controls third. |
| PL-16 | P2 — First Month | Notifications and review operations | No admin review interface or documented ownership exists; future submissions are only described in `docs/architecture.md`. | Add email notifications, assignment/status rules, service-level expectations, export, and a simple admin review view before considering a full dashboard. | Ensures leads and applicants are acted on rather than merely stored. | HR, Operations, IT / Susan | Working backend and named process owners | 2–5 days | Notifications and ownership first; review UI only after real volume appears. |
| PL-17 | P2 — First Month | Fabrication and trade media | Available imagery covers shop, welding, machining, and steel, but Coatings and Assembly still use designed fallbacks in `src/app/page.tsx` and `src/app/careers/page.tsx`. Current video originals are 4K and 13.58–51.07 MB per `docs/media-inventory.md`. | Capture coatings and assembly work; encode selected fabrication and construction clips into short 1080p H.264/WebM assets; create a restrained hero loop and social-ready vertical cuts. | Gives every stated capability visual proof and adds motion without slowing the site. | Fabrication, Construction, Marketing / Jacob | Approved category scope, releases, video editor | 1–3 days | Fill missing trade coverage first; encode one hero loop; then social variants. |
| PL-18 | P2 — First Month | Structured SEO and local discovery | No Organization, LocalBusiness, or JobPosting schema exists; no Search Console, Bing Webmaster Tools, or local-search setup is documented. | Add Organization and LocalBusiness schema after address/service-area approval; add JobPosting schema only for real openings; connect Search Console and Bing; align name/address/phone and Google Business Profile. | Improves branded, local, service, and recruiting discovery. | IT / Susan, HR, Marketing / Jacob | Final domain, public business identity, real jobs | 1–2 days | Organization/local data first; webmaster tools second; JobPosting only with live jobs. |
| PL-19 | P2 — First Month | Image discovery and performance | `src/content/media.ts` has useful alt text, but camera filenames remain public and there is no formal alt-text or crop review. | Rename future assets descriptively, review alt text for purpose and privacy, record dimensions/subject/rights, and monitor LCP/CLS/image transfer by route. | Improves maintainability, accessibility, search context, and performance. | Marketing / Jacob | Media metadata process | 2–4 hours for current set | Apply naming/metadata rules to new assets; avoid churn solely to rename existing URLs unless redirects are planned. |
| PL-20 | P2 — First Month | Conversion analytics | No CTA, application, quote, scroll-depth, traffic-source, or campaign-attribution events exist. | Track career CTA clicks, application start/completion, quote request start/completion, key scroll depth, referrer/UTM source, and recruiting campaign attribution after consent review. | Shows which content and campaigns create applicants and project inquiries. | HR, Marketing / Jacob, IT / Susan | PL-08 analytics decision and working forms | 1–2 days | Define decisions and event names first; add only events that change action. |
| PL-21 | P2 — First Month | UX states | Contact has only a disabled state; Careers has a development status; no production loading, error, confirmation, or thank-you pages exist. The framework supplies a generic 404. | Design accessible loading/error states, genuine form confirmation, thank-you pages, recovery instructions, and a branded 404 with useful navigation. | Reassures users and prevents dead ends once forms and dynamic data launch. | Jacob | Production forms and job data behavior | 1–2 days | Error/success copy with forms first; branded 404 and loading polish second. |
| PL-22 | P2 — First Month | Technical quality and security headers | `next.config.ts` only disables `poweredByHeader`; no Content Security Policy (CSP) or explicit security headers exist. Test coverage is absent and dependencies are pinned through `package-lock.json`. | Review dependency updates; add appropriate security headers and a staged Content Security Policy; document backup/restore expectations; add smoke tests for routes, forms, and metadata. | Reduces regression and browser-security risk as third-party services and forms are introduced. | IT / Susan, Jacob | Final third-party inventory and deployment environment | 2–4 days | Dependency/security-header review first; CSP in report-only/staging; tests around real workflows. |
| PL-23 | P2 — First Month | Deployment workflow | Git is on `main` and Vercel-ready, but there is no repository deployment guide, branch protection, preview/production policy, release checklist, or environment matrix beyond README placeholders. | Document preview versus production, protected branches, approval expectations, rollback, domain/DNS ownership, environment variables, and deployment verification. | Makes releases repeatable and prevents accidental production changes or secret misuse. | IT / Susan, Jacob | GitHub/Vercel admin access | 2–4 hours | Protect `main`, document preview flow, then add rollback and environment matrix. |
| PL-24 | P2 — First Month | Portfolio and proof | Home is media-led, but there are no named projects, case studies, customer stories, results, news, or employee spotlights. | Build the first approved project portfolio entries and one employee spotlight without inventing clients, project names, or outcomes. | Gives customers proof and gives candidates a clearer picture of completed work. | Construction, Fabrication, Marketing / Jacob | Customer releases and factual project inputs | 2–5 days for first three entries | Publish one strong construction case and one fabrication proof point before expanding. |
| PL-25 | P2 — First Month | Media intake pipeline | `docs/architecture.md` proposes `media_submissions` and `media_content_usage`, but no Axe Media Drop or SharePoint intake workflow is implemented. | Define SharePoint-to-Axe-Digital metadata intake, submitter/rights fields, review states, approval roles, usage tracking, and archive organization. | Turns ad hoc media into a governed reusable asset library. | IT / Susan, Marketing / Jacob, HR, Operations | Media governance from PL-06 | 3–5 days for workflow design and manual pilot | Pilot with a spreadsheet/list and one weekly review before building automation. |

## P3 — Future Phase

| ID | Priority | Category | Current state | Improvement needed | Business value | Suggested owner | Dependencies | Estimated effort | Recommended sequence |
|---|---|---|---|---|---|---|---|---|---|
| PL-26 | P3 — Future Phase | CMS and administration | Page copy and media mappings are source-controlled; jobs are local sample data; no nontechnical editing interface exists. | Evaluate an editable CMS, job-opening management, media selection, admin dashboard, and role-based publishing only after recurring update needs are known. | Lets approved owners update content without code changes while retaining governance. | Owner / President, HR, IT / Susan, Jacob | Stable content model, roles, audit requirements | 2–6 weeks | Measure manual update volume first; build the smallest admin surface that solves it. |
| PL-27 | P3 — Future Phase | Advanced applicant tracking | No ATS integration or advanced recruiting workflow exists. | Add applicant stages, interviewer notes, disposition reasons, reminders, reporting, and integration with an external ATS only if hiring volume justifies it. | Improves recruiting operations at scale. | HR, IT / Susan | Production applications, policy, real volume | 3–8 weeks | Start with simple status ownership; integrate only after the process is stable. |
| PL-28 | P3 — Future Phase | Social and media automation | No weekly reel, AI clip ranking, caption generation, aspect-ratio exports, content calendar, or publishing integration exists. | Create a human-approved weekly workflow for clip ranking, captions, 9:16/1:1/16:9 exports, scheduling to Instagram, Facebook, TikTok, and YouTube Shorts, and usage tracking. | Multiplies recruiting and brand reach from the same approved media library. | Marketing / Jacob, HR, Operations | PL-25 intake, releases, channel strategy, human approval | 4–10 weeks | Manual weekly reel first; assisted ranking/exports second; publishing automation last. |
| PL-29 | P3 — Future Phase | Growth features | There is no news system, social feed, campaign landing-page framework, or automated quote-intake workflow. | Add news, employee spotlights, recruiting campaign pages, social feed integration, and quote workflow automation only when owners and update cadence exist. | Supports sustained recruiting and business-development campaigns. | Marketing / Jacob, HR, Operations, IT / Susan | Analytics, CMS/workflow decisions, content owners | 3–8 weeks | Campaign landing pages before social feeds; quote automation only after form operations mature. |

## Leadership Content Request List

These requests improve the site after a safe Version 1 launch; none should delay tomorrow’s launch.

### Owner / President

- Approved company history, founding milestones, purpose statement, operating values, leadership bios, and long-term company direction.
- Three defensible company differentiators and the markets Axe most wants to serve.
- Approval for one construction project and one fabrication project to become initial case studies.

### HR

- Standard job information template covering pay ranges, benefits, shift schedules, travel, physical requirements, qualifications, training, and advancement.
- Approved hiring-process steps, response expectations, employee-testimonial candidates, and applicant retention policy.
- Written employee photo/likeness procedure and approved recruiting language.

### Construction

- Detailed service list, geographic coverage, project types, equipment strengths, finished-project candidates, drone opportunities, and customer-release contacts.
- One construction story with factual scope, challenge, work performed, and approved outcome.

### Fabrication

- Materials, processes, equipment, capacity boundaries, welding/machining/coatings/assembly details, certifications that may be public, and representative finished work.
- Coatings and assembly photo/video opportunities plus one fabrication proof story.

### Safety

- Approved public safety philosophy, training/certification facts, PPE/media standards, and rules for publishing active-jobsite imagery.

### Marketing / Jacob

- Final editorial voice guide, photo shot list, social channel priorities, content calendar owner, campaign naming/UTM convention, and OpenGraph artwork.
- Descriptive asset naming and metadata standards for future uploads.

### IT / Susan

- Preferred analytics/consent approach, domain/DNS ownership, Search Console/Bing access, Vercel role ownership, branch-protection policy, monitoring choice, and backup/retention expectations.
- Approved architecture and access model for the first Supabase-backed workflow.

## Recommended First-Week Sprint

1. Observe the live launch for broken links, contact failures, mobile crop issues, and production errors; fix verified defects first.
2. Finalize the domain/canonical/robots decision, favicon, sitemap, and OpenGraph preview.
3. Install analytics only after the privacy/consent decision, then capture a baseline rather than adding many events.
4. Collect the first real job posting and standardized HR content template.
5. Define contact/quote form requirements and backend ownership while keeping direct contact fallbacks live.
6. Establish the media approval/likeness/customer-release sheet.
7. Request the next media batch: finished construction, drone scale, real employees, and active equipment.
8. Fix semantic route headings and perform the focused accessibility/browser/mobile review.

## Recommended First-Month Roadmap

1. **Week 1:** SEO essentials, monitoring/analytics decision, accessibility/browser fixes, real job template, and media governance.
2. **Week 2:** First production contact/quote form with server validation, spam controls, routing, privacy language, and confirmation.
3. **Week 3:** First secure careers workflow or job publishing workflow, including retention, notifications, and only the Supabase tables required for it.
4. **Week 4:** Publish the first project proof content, improve About/Services depth, add selected optimized video, and connect Search Console/Bing/local-business data.
5. End the month by reviewing actual traffic, inquiries, and recruiting behavior before approving CMS, dashboard, or automation scope.

## Deferred Ideas

The following should not distract from immediate website completion:

- Full editable CMS before update volume and publishing roles are understood.
- Automated weekly AI reel generation before media rights, manual workflow, and human approval are reliable.
- Employee portal or authenticated employee experience.
- Advanced applicant tracking before the basic HR intake process is stable.
- Deep integration with Axe Operations or any other existing operational/material-management database; this website must remain separate.
- Public project-data integrations that could expose customer, schedule, financial, material, or operational information.
- Fully automated social publishing without human review.
- Large admin dashboard before simple email/status workflows demonstrate a need.
- Live social-feed embeds that add privacy, performance, moderation, or availability risk without clear conversion value.
