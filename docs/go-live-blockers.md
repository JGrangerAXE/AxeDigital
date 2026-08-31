# Axe Build Website — Go-Live Blockers

## Launch Standard

The minimum acceptable Version 1 launch must be:

- Professional and credible, without visible development notes or placeholder business details.
- Accurate about Axe Build, LLC, its capabilities, careers, and current opportunities.
- Usable on mobile, with working navigation and readable media and text.
- Free of misleading sample content or controls that appear to work but do not.
- Contactable through at least one monitored public phone number or email address.
- Legally reasonable for the data actually collected and the media actually published.
- Free of broken functionality, exposed secrets, major broken links, and missing referenced media.

## Executive Summary

- **Launchable today:** No. The site is technically sound, but it still exposes missing contact details, development-only legal/content language, unverified capability claims, and media whose public-use approval is not documented in the repository.
- **Launchable by EOD tomorrow:** Yes. This is realistic if leadership makes a small number of decisions early and the launch uses simple fallbacks instead of completing every backend feature.
- **Total blockers:** 10.
- **Critical blockers:** 4.
- **Conditional blockers:** 6.
- **Fastest realistic path:** Confirm the six public capability categories and media rights; provide one public phone number plus monitored quote/general and careers inboxes; publish a short interim privacy policy; remove sample jobs; hide both nonfunctional forms and resume upload; replace visible development wording with minimal approved copy; then deploy the static site without Supabase.

The technical audit found no launch-blocking build or navigation defect. Lint passed, a production build passed with all Supabase variables absent, all seven public routes rendered, the default 404 worked, the mobile menu worked at 390 px, no tested page overflowed horizontally, and all referenced media paths resolved. The repository is clean on `main`, synchronized with `origin/main`, and contains no obvious secret-pattern matches.

## Blocker Classification

### Critical

#### GLB-01 — No usable public contact channel

- **ID:** GLB-01
- **Severity:** Critical
- **Category:** Contact and business identity
- **Page or file location:** `src/app/contact/page.tsx` (`Contact`); `src/components/layout/Footer.tsx` (`Footer`); Home customer CTAs in `src/app/page.tsx`.
- **Current state:** The Contact page and footer show `Phone: To be confirmed`, `Email: To be confirmed`, and `Location: To be confirmed`. The Contact page form is disabled and says `Submission coming soon`. Home routes project partners and quote requests to this page.
- **Why it blocks launch:** A customer-facing construction website that invites quote requests but provides no working contact method is materially broken and not credible.
- **Exact decision or information needed:** Provide the public phone number; provide the monitored general/quote inbox; decide whether a physical or mailing address or only a city/service area should be shown; identify who owns response monitoring.
- **Fastest acceptable Version 1 solution:** Publish a clickable phone number and email address, remove the disabled form, and route both general and quote inquiries to the monitored inbox.
- **Preferred long-term solution:** A working contact/quote form with server-side validation, spam protection, routing, error handling, confirmation, and retention rules.
- **Suggested owner:** Owner / President for public details; IT / Susan for inbox ownership; Jacob for implementation and verification.
- **Estimated effort:** 30 minutes after the information is supplied.
- **Can it be temporarily removed or hidden?:** The disabled form and unapproved location can be hidden. Contactability itself cannot be removed.

#### GLB-02 — Privacy page is explicitly a development placeholder

- **ID:** GLB-02
- **Severity:** Critical
- **Category:** Legal and privacy
- **Page or file location:** `src/app/privacy/page.tsx` (`Privacy`); privacy link in `src/components/layout/Footer.tsx`; future data practices described in `docs/architecture.md`.
- **Current state:** The page says `A final privacy policy will be published` and `Before launch, this page must be replaced`. No analytics, cookies, form transmission, or Supabase-backed storage are active, so the immediate data footprint is small, but the visible legal page is not launch copy.
- **Why it blocks launch:** A public site should not label its own legal notice as unfinished. It creates avoidable credibility and legal risk even when the current site collects no form data.
- **Exact decision or information needed:** Confirm that Version 1 collects no form data, uses no analytics/advertising cookies, and uses only normal Vercel hosting logs; provide the privacy contact; confirm whether leadership or counsel must approve the interim wording.
- **Fastest acceptable Version 1 solution:** Publish a short interim policy accurately stating what the static site does and does not collect, the hosting provider involved, how direct email/phone inquiries are handled, and how to make a privacy request.
- **Preferred long-term solution:** Counsel-reviewed policy covering applications, resumes, quotes, analytics/cookies, media submissions, retention, access, deletion, and service providers as those features are added.
- **Suggested owner:** IT / Susan and Owner / President, with legal review if required; Jacob for publication.
- **Estimated effort:** 30 minutes for a simple no-forms/no-analytics interim policy.
- **Can it be temporarily removed or hidden?:** No. Replace it with accurate interim language rather than hiding it.

#### GLB-03 — Public capabilities are not yet confirmed

- **ID:** GLB-03
- **Severity:** Critical
- **Category:** Messaging and capability accuracy
- **Page or file location:** Capability grid in `src/app/page.tsx`; `capabilities` and page copy in `src/app/what-we-do/page.tsx`; company positioning in `src/app/about/page.tsx`; descriptions in `src/app/layout.tsx` and page metadata.
- **Current state:** The site publicly presents Construction, Fabrication, Welding, Machining, Coatings, and Assembly. The What We Do page simultaneously says specific services, materials, processes, tolerances, and capacities are `to be confirmed` or `to be documented`.
- **Why it blocks launch:** Core service claims must be true. Publicly presenting an unconfirmed capability can misroute customers or create a material business representation Axe does not support.
- **Exact decision or information needed:** Construction leadership must confirm the construction category and public service scope; fabrication leadership must confirm Fabrication, Welding, Machining, Coatings, and Assembly; the Owner / President must confirm the construction-first/fabrication-growth positioning.
- **Fastest acceptable Version 1 solution:** Approve the category names only and remove any category that cannot be confirmed. Keep Version 1 descriptions broad and factual; do not publish capacities, certifications, tolerances, or processes until documented.
- **Preferred long-term solution:** Approved service pages with markets served, equipment, processes, capacities, certifications, geography, differentiators, and representative project media.
- **Suggested owner:** Owner / President, Operations / Construction, Fabrication, and Jacob.
- **Estimated effort:** 30 minutes for a focused approval meeting.
- **Can it be temporarily removed or hidden?:** Individual unconfirmed categories and the What We Do route can be hidden, but the remaining homepage positioning must still be accurate.

#### GLB-04 — Public-use rights for current media are not documented

- **ID:** GLB-04
- **Severity:** Critical
- **Category:** Media, brand, and permissions
- **Page or file location:** Media map in `src/content/media.ts`; use throughout `src/app/page.tsx`, `src/app/careers/page.tsx`, `src/app/about/page.tsx`, and `src/app/what-we-do/page.tsx`; asset notes in `docs/media-inventory.md`; missing approval inputs listed in `docs/content-needed.md`.
- **Current state:** The site uses real jobsites, equipment, shop environments, and workers. The repository documents a need for employee likeness and customer/site approval rules but contains no rights or release record. One displayed crew image is intentionally cropped to avoid a corrupted lower portion; no referenced image failed during runtime testing.
- **Why it blocks launch:** Axe must be able to confirm it owns or may publicly use the images and that visible workers, customers, sites, signage, or project details are cleared. This is a legal and relationship risk, not a design preference.
- **Exact decision or information needed:** Confirm ownership/source for every displayed asset; confirm employee photo consent expectations; confirm customer/jobsite approval; identify any asset that must not be public.
- **Fastest acceptable Version 1 solution:** Leadership, HR, and Operations review the 14 referenced assets listed in `src/content/media.ts` and approve or remove each one before deployment.
- **Preferred long-term solution:** A media-rights register with asset owner, employee likeness approval, customer/project release, permitted channels, expiration, and usage history.
- **Suggested owner:** Owner / President, HR, Operations / Construction, Fabrication, and Jacob.
- **Estimated effort:** 15 minutes if the media source and permissions are already known.
- **Can it be temporarily removed or hidden?:** Yes. Remove any uncertain asset, but retain only images that have affirmative approval.

### Conditional

#### GLB-05 — Contact and quote form is visible but intentionally nonfunctional

- **ID:** GLB-05
- **Severity:** Conditional
- **Category:** Contact and quote forms
- **Page or file location:** `src/app/contact/page.tsx` (`Contact`).
- **Current state:** The form has no action or handler, no required-field behavior, no routing, no spam protection, and a disabled `Submission coming soon` button. It correctly states that it does not submit or store information.
- **Why it blocks launch:** It does not falsely claim success, but a prominent dead form on the primary customer route makes the site look unfinished. It is required only if the form remains visible.
- **Exact decision or information needed:** Decide whether Version 1 uses a real form or direct phone/email links; if a form is required, provide the quote-routing inbox and approved fields/privacy disclosure.
- **Fastest acceptable Version 1 solution:** Hide the form and replace it with clickable phone and email CTAs.
- **Preferred long-term solution:** A server-handled quote/contact flow with validation, spam controls, rate limiting, routing, confirmation, error states, and retention policy.
- **Suggested owner:** Owner / President, IT / Susan, and Jacob.
- **Estimated effort:** 15 minutes for the fallback; More than 1 hour for a responsible functional form.
- **Can it be temporarily removed or hidden?:** Yes; this is the recommended Version 1 decision.

#### GLB-06 — Two development sample jobs are displayed publicly

- **ID:** GLB-06
- **Severity:** Conditional
- **Category:** Careers and job listings
- **Page or file location:** `src/content/sample-jobs.ts`; import and rendering in `src/app/careers/page.tsx`; presentation in `src/components/careers/JobListings.tsx`.
- **Current state:** `Welder / Fabricator` and `Construction Team Member` appear under Open Opportunities. They are visibly labeled `Sample Listing — Not an active opening`, use `Location to be confirmed`, and are described as development samples.
- **Why it blocks launch:** The labels reduce deception risk, but public sample openings still create applicant confusion and make the recruiting page look unfinished. It is required only if the listings section remains visible.
- **Exact decision or information needed:** HR must provide approved active openings or confirm that the launch should show no openings.
- **Fastest acceptable Version 1 solution:** Remove the sample records and render the existing honest empty state, or replace them with approved real jobs.
- **Preferred long-term solution:** Approved jobs managed in a publishing workflow with status, location, pay where required, requirements, description, and publish/close dates.
- **Suggested owner:** HR and Jacob.
- **Estimated effort:** 15 minutes for the empty-state fallback.
- **Can it be temporarily removed or hidden?:** Yes. Remove the sample cards; the Careers page can launch without active openings.

#### GLB-07 — General careers form and resume control do not submit

- **ID:** GLB-07
- **Severity:** Conditional
- **Category:** Careers, applicant data, and forms
- **Page or file location:** `src/components/careers/ApplicationForm.tsx`; General Interest section in `src/app/careers/page.tsx`; validation scaffold in `src/lib/validation/careers.ts`.
- **Current state:** The form validates required fields only in the browser and then says `Development preview only — your information was validated but was not submitted or stored.` The button says `Validate Interest Form`. Resume upload is visible but disabled. There is no routing, storage, confirmation email, server validation, spam protection, applicant privacy consent, retention rule, or EEO language.
- **Why it blocks launch:** It is transparent rather than deceptive, but a recruiting CTA that cannot reach HR is not a functional public application path. Resume and applicant privacy obligations become material if collection is enabled.
- **Exact decision or information needed:** HR must decide whether general interest is accepted at launch; provide a monitored careers inbox; confirm whether resumes may be emailed; confirm applicant privacy/retention requirements and whether EEO/affirmative-action wording is required for Axe.
- **Fastest acceptable Version 1 solution:** Hide the form and disabled resume control; replace them with `Email careers@…` or `Call … about opportunities`, with no applicant data stored by the website.
- **Preferred long-term solution:** Secure server-side application handling, private resume storage, malware/type/size checks, HR routing, confirmation, access control, audit trail, retention/deletion, and appropriate employment notices.
- **Suggested owner:** HR, IT / Susan, and Jacob.
- **Estimated effort:** 15 minutes for the direct-contact fallback; More than 1 hour for a responsible application workflow.
- **Can it be temporarily removed or hidden?:** Yes; this is the recommended launch choice unless a backend and policy are completed.

#### GLB-08 — About and What We Do pages visibly describe themselves as unfinished

- **ID:** GLB-08
- **Severity:** Conditional
- **Category:** Placeholder and unapproved content
- **Page or file location:** `src/app/about/page.tsx`; `src/app/what-we-do/page.tsx`; primary navigation in `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx`.
- **Current state:** About says `Approved company history and leadership details will be added here`, `The final About page will tell Axe’s story`, and multiple topics `require leadership approval`. What We Do says the capability map `will be refined` and every capability description says details are to be confirmed or documented.
- **Why it blocks launch:** These pages are primary navigation destinations and look like an internal prototype. They must be resolved only if they remain public and linked.
- **Exact decision or information needed:** Approve a short company description and a minimal factual capability summary, or decide to remove these pages from launch navigation.
- **Fastest acceptable Version 1 solution:** Replace development notes with one short approved paragraph per page, or temporarily remove the routes from navigation while retaining Home, Careers, Contact, and Privacy.
- **Preferred long-term solution:** Full approved company story, history, leadership, values, differentiators, services, markets, geography, safety story, and project evidence.
- **Suggested owner:** Owner / President, Operations / Construction, Fabrication, and Jacob.
- **Estimated effort:** 30 minutes after approvals.
- **Can it be temporarily removed or hidden?:** Yes.

#### GLB-09 — Recruiting promises and hiring-process language need HR confirmation

- **ID:** GLB-09
- **Severity:** Conditional
- **Category:** Careers messaging requiring approval
- **Page or file location:** `jobValues` in `src/app/page.tsx`; `values`, `expectations`, and `process` in `src/app/careers/page.tsx`; footer recruiting statement in `src/components/layout/Footer.tsx`.
- **Current state:** Copy promises or implies `Career growth`, `Room to Grow`, focused learning, greater responsibility, and a four-step process ending in `Get to Work`. Compensation, schedule, benefits, training, and advancement are correctly marked as position-specific and unconfirmed. No wages, benefits, schedules, or testimonials are invented.
- **Why it blocks launch:** The language is restrained, but HR should confirm that the growth/training and process claims reflect actual practice. It is required only if those statements remain visible.
- **Exact decision or information needed:** HR approval or replacement of the specific growth, learning, responsibility, and hiring-process statements; confirmation of any required equal-opportunity language.
- **Fastest acceptable Version 1 solution:** Approve the low-risk statements as written or remove the unconfirmed growth/process phrases while keeping the factual skilled-work message.
- **Preferred long-term solution:** Approved recruiting message framework tied to actual training, progression, job requirements, and hiring operations.
- **Suggested owner:** HR and Owner / President.
- **Estimated effort:** 15 minutes.
- **Can it be temporarily removed or hidden?:** Yes; individual claims can be removed without taking Careers offline.

#### GLB-10 — Production URL and indexing decision is unresolved

- **ID:** GLB-10
- **Severity:** Conditional
- **Category:** Technical deployment and SEO
- **Page or file location:** Root metadata in `src/app/layout.tsx`; deployment assumptions in `README.md`; no `src/app/robots.ts`, `src/app/sitemap.ts`, or canonical metadata exists.
- **Current state:** `metadataBase` and OpenGraph URL are hardcoded to `https://axebuild.com`, while the planned immediate launch may use a Vercel URL. Robots metadata currently permits `index, follow`. OpenGraph has no image and every route inherits the same Axe title/URL. HTTPS is expected from Vercel but no live deployment was part of this audit.
- **Why it blocks launch:** It is required only if the public URL is not `https://axebuild.com` or if the temporary Vercel URL should not be indexed. Sharing a Vercel launch with OpenGraph pointing to an unavailable domain is inaccurate; unintentionally indexing a temporary review URL creates cleanup work.
- **Exact decision or information needed:** Decide the exact launch URL; decide whether search engines should index the temporary URL; confirm whether the custom domain will be connected tomorrow.
- **Fastest acceptable Version 1 solution:** Use the Vercel URL, set metadata to the live URL, and use `noindex` until the custom domain is ready—or connect the domain and keep indexing enabled.
- **Preferred long-term solution:** Environment-aware canonical metadata, sitemap, robots policy, redirects, OpenGraph assets, Search Console, and a single canonical production domain.
- **Suggested owner:** IT / Susan and Jacob.
- **Estimated effort:** 15 minutes after the URL/indexing decision.
- **Can it be temporarily removed or hidden?:** The custom domain can be deferred; inaccurate URL/indexing metadata should not be left unresolved.

## Minimum Information Leadership Must Provide Tomorrow

### Owner / President

- Confirm that the legal public name is exactly `Axe Build, LLC`.
- Approve or replace the homepage headline `BUILD SOMETHING REAL.` and supporting line `Serious work. Valuable skills. A career you can be proud of.`
- Confirm the public positioning: construction company with a growing fabrication/manufacturing division.
- Provide the public phone number and approve whether a city, service area, shop address, mailing address, or no address is shown.
- Approve the six high-level capability categories or identify which must be removed.
- Confirm that the displayed Axe-owned media may be published, subject to HR and project/customer checks.

### HR

- Provide the monitored careers email address and the person responsible for responses.
- Confirm whether the two sample job cards must be removed or replaced with approved active openings.
- Confirm whether the general-interest careers form may be published before backend submission is connected; recommended answer for tomorrow is no.
- Approve or remove the `Career growth`, `Room to Grow`, learning, responsibility, and four-step hiring-process language.
- Confirm employee likeness approval for displayed workers and whether an EEO/affirmative-action statement is required.

### Operations / Construction

- Confirm what `Construction` may mean publicly at launch and any service or geographic limitation that must be stated.
- Approve or reject each displayed construction/jobsite image, including any customer or site-sensitive content.

### Fabrication

- Confirm whether Fabrication, Welding, Machining, Coatings, and Assembly are all public capabilities today.
- Approve or reject each displayed shop, equipment, welding, cutting, and material image.

### IT / Susan

- Provide or confirm the monitored general/quote-routing inbox and careers-routing inbox.
- Confirm that Version 1 has no form submission, Supabase connection, analytics, advertising cookies, or resume storage if the recommended fallbacks are used.
- Provide the privacy-contact inbox and confirm whether interim privacy wording needs counsel review.
- Decide with Jacob whether the launch uses the Vercel URL or `axebuild.com`, and whether the temporary URL should be indexed.

### Jacob

- Present the explicit fallback package for approval: direct contact links, no sample jobs, no careers/contact forms, no resume upload, no Supabase, and minimal approved About/Capabilities copy.
- Maintain the 14-asset launch approval list from `src/content/media.ts` and remove anything not affirmatively cleared.
- Record the final public phone, inboxes, approved copy, launch URL, and indexing decision in one launch sheet before implementation.

## Fastest Launch Plan

### First 30 Minutes

1. Hold a decision meeting with Owner / President, HR, Operations, Fabrication, IT / Susan, and Jacob.
2. Approve or remove each of the six capability categories.
3. Approve or remove each of the 14 displayed media assets.
4. Capture the public phone, quote/general inbox, careers inbox, privacy contact, and address/service-area display decision.
5. Approve `BUILD SOMETHING REAL.` and the restrained recruiting statements, or mark exact phrases for removal.
6. Adopt the fallback launch: no active website forms, no resume upload, no sample jobs, and no Supabase.

### First 2 Hours

1. Replace all `To be confirmed`, `development`, `preview`, `future`, and `final page` public wording.
2. Replace the Contact form with phone/email CTAs and a clear quote-routing email.
3. Remove sample jobs and show the honest no-openings state unless HR supplies real postings.
4. Replace the Careers form/resume section with the careers email/phone fallback.
5. Publish the approved interim privacy policy for a static, no-analytics, no-form launch.
6. Reduce About and What We Do to approved factual copy, or temporarily remove them from navigation.
7. Apply the approved media list and remove anything uncertain.
8. Set metadata and indexing for the chosen Vercel or custom-domain URL.

### Before Final Deployment

1. Run lint and the production build with Supabase variables absent.
2. Confirm the Git branch contains only approved launch changes and no `.env` files or secrets.
3. Import the GitHub repository into Vercel with no Supabase variables.
4. Use the Vercel URL until DNS access is available; do not let the custom domain delay the fallback launch.
5. Verify the deployed Contact and Careers fallbacks route to monitored destinations.
6. Search the live pages for `To be confirmed`, `Sample Listing`, `Development`, `preview`, `coming soon`, and `final policy`.

### Final Public Verification

1. Open Home, Careers, What We Do, About, Contact, Privacy, and an invalid URL on desktop and mobile.
2. Test header, mobile menu, footer, skip link, every CTA, every phone link, and every email link.
3. Confirm no horizontal overflow, broken images, missing logo, disabled public controls, or misleading success messages.
4. Confirm the live page uses HTTPS and the intended index/noindex behavior.
5. Share the URL once in text/social preview and confirm the destination and title are correct.
6. Place one real test phone call and one real test email to each published inbox; confirm an owner receives them.

## Launch Decision Matrix

| Feature | Launch Functional | Hide Temporarily | Replace With Simple Fallback | Must Finish |
|---|---|---|---|---|
| Contact form | No | Yes | Public phone and general email | No, if fallback works |
| Quote request | No | Yes | Quote-routing email and phone | Contactability must work; form need not |
| General careers form | No | Yes | Careers email or phone | No, if fallback works |
| Resume upload | No | Yes | Email only if HR approves resume-by-email | No |
| Job listings | Samples only | Yes | Honest no-openings message or real approved jobs | No |
| Supabase | Not connected | Keep inactive | None needed for static launch | No |
| Analytics | Not installed | Keep absent | Vercel operational logs only | No |
| Social links | Not present | Continue omitting | None | No |
| Project portfolio | Not present | Continue omitting | Current media-led Home page | No |
| Weekly media automation | Not present | Defer | Manual approved media updates | No |
| Custom domain | Not confirmed | Defer | Public Vercel URL with correct metadata/indexing | No |

## Final Go/No-Go Checklist

- [ ] Public phone and monitored general/quote contact are visible and tested.
- [ ] Careers contact path is visible and tested, or Careers makes no application promise.
- [ ] Disabled forms, resume upload, and sample job records are removed from public view.
- [ ] Interim privacy policy accurately matches the no-forms/no-analytics launch.
- [ ] All public capability categories are confirmed by the responsible leaders.
- [ ] All displayed media has employee/customer/site approval or has been removed.
- [ ] No public page contains `To be confirmed`, development, preview, sample, or future-policy wording.
- [ ] Recruiting growth/training/process language has HR approval or is removed.
- [ ] Launch URL and index/noindex decision are reflected in metadata.
- [ ] No secrets or populated `.env` files are committed or configured unnecessarily.
- [ ] Production lint and build pass without Supabase variables.
- [ ] All routes, CTAs, navigation, contact links, logo, media, 404, and mobile menu pass on the live HTTPS URL.
