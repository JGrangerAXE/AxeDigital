# Architecture

## Application shape

The project uses the Next.js App Router, TypeScript, Tailwind CSS, and custom React components. Pages are server components by default. Interactive elements such as the mobile menu and careers interest form are isolated client components.

- `src/app/`: routes, metadata, global styling, and the shared layout
- `src/components/layout/`: navigation and footer
- `src/components/home/`: reserved for additional home-specific modules
- `src/components/careers/`: job listing and interest-form components
- `src/components/shared/`: reusable interface pieces
- `src/content/`: local development content and sample records
- `src/lib/supabase/`: browser, server, and service-role client factories
- `src/lib/validation/`: shared input validation
- `src/types/`: shared domain types
- `public/`: approved logos, images, and video assets
- `supabase/migrations/`: intentionally empty until a schema is approved

## Data and security boundaries

This website is independent from every other Axe system and database. It must use a dedicated Supabase project. Public browser code may use only the URL and anonymous key. The service-role key is restricted to server-only modules and must never be sent to a browser.

The employment application uses a server-only route handler. Other public forms remain unconnected. Rate limiting, managed bot protection, an HR review interface, and a formally approved retention schedule remain deferred.

## Recruiting workflow

The production employment-application flow is:

1. `ApplicationForm` sends multipart form data to `POST /api/careers/applications`.
2. The route validates every field and the optional resume on the server using the same centralized career-area values as the browser.
3. The route creates a UUID and uploads an optional PDF or DOCX resume to the private `employment-resumes` bucket under `<application-id>/<sanitized-filename>`.
4. The route inserts the private `employment_applications` row with email status `pending`.
5. The server generates a branded applicant-summary PDF using the applicant's normalized submitted text without AI alteration or summarization.
6. The Resend provider sends the PDF and original resume, when supplied, to `APPLICATION_RECIPIENT_EMAIL`.
7. The database row is updated to `sent` or `failed`. A notification failure never deletes the application or resume and still produces the applicant success state.

`employment_applications` contains the approved seven required fields, optional message, optional resume metadata/path, application status, email-delivery state and timestamps, provider message ID/error summary, and audit timestamps. It intentionally contains no interview, offer, scoring, demographic, identity-document, address, reference, education-history, or employment-history fields.

The migration is `supabase/migrations/20260828000100_employment_applications.sql` and has been applied to the dedicated Axe Digital Supabase project. It enables and forces RLS, revokes table privileges from `anon` and `authenticated`, grants the service role access, creates no public table/storage policies, and provisions `employment-resumes` as a private bucket with a 5 MB PDF/DOCX limit.

The browser never receives the service-role key and never talks directly to the table or resume bucket. `src/lib/supabase/server.ts` is protected by `server-only`; the API route is the trust boundary. Future HR access should use signed, short-lived storage URLs from authenticated server code or an authenticated admin application. No permanent public resume URLs should be created.

Resend is isolated behind `ApplicationEmailProvider`. Attachments are sent as Base64 content, not public URLs. Resend currently limits email payloads to 40 MB after Base64 encoding, which is safely above this workflow's 5 MB resume limit plus generated PDF. During testing, Resend's `resend.dev` sender can send only to the address associated with the Resend account; sending to other recipients requires a verified domain. See [Resend attachment documentation](https://resend.com/docs/api-reference/emails/send-email) and [Resend development sender restrictions](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

### Recruiting configuration

- `NEXT_PUBLIC_SUPABASE_URL`: Axe Digital Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public key retained for future public website use; the application route does not use it.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only key used by the application route.
- `APPLICATION_RECIPIENT_EMAIL`: internal recipient. Set this to the temporary development recipient now, then change only this environment value to `resumes@axebuild.com` when that mailbox exists.
- `APPLICATION_FROM_EMAIL`: verified Resend sender, including an optional display name.
- `RESEND_API_KEY`: server-only Resend API credential.
- `PRIVACY_CONTACT_EMAIL`: public privacy contact rendered on the Privacy page when configured.

All values belong in local `.env.local` or Vercel environment settings and must never be committed. If email configuration is absent or delivery fails after database storage, the row is marked `failed` and the applicant still sees an accepted response. Failed notifications can later be found by querying `email_delivery_status = 'failed'`; a trusted retry job can regenerate the PDF from the stored row, privately download the resume if present, resend the package, and update the delivery fields. That retry job is intentionally not part of Version 1.

## Proposed future tables

No tables or migrations have been created or applied.

- `job_openings`: approved public job postings, status, career area, location, description, and publish dates
- `employment_applications` is now defined by the recruiting migration above.
- `contact_submissions`: general inquiries and routing state
- `quote_requests`: project inquiry details and routing state
- `media_submissions`: incoming Axe Media Drop assets, submitter, consent, review, and storage references
- `media_content_usage`: approved placement, channel, usage dates, rights status, and asset relationships

Resume and media files should use private object storage, signed access, strict policies, file checks, and documented deletion schedules. Rows should store object references rather than public URLs.

## Content flow

Job listings should be queried server-side and filtered to approved, published records. Remaining public forms should post to server-only handlers, never directly with elevated credentials. Approved media must remain independent from operational/material-management data.

## Intentionally deferred recruiting features

- Applicant admin dashboard and HR login
- Interview, offer, scoring, ranking, or rejection workflows
- AI resume analysis or response summarization
- Job-posting CMS
- Automated email retry job and delivery webhooks
- Advanced applicant tracking and HR reporting
- Integration with Axe Operations or any other Axe database

## Accessibility and performance

The interface uses semantic sections, labeled fields, keyboard-accessible navigation, visible focus states, reduced-motion support, responsive layouts, and high-contrast colors. Future media must include useful alternative text or captions, optimized formats, explicit dimensions, and restrained autoplay behavior.
