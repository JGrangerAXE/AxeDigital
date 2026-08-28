# Careers Application — Manual End-to-End Test Plan

## Preconditions

1. Confirm the Supabase project is the dedicated **Axe Digital** project, not Axe Operations or material traceability.
2. From the repository root, link only after obtaining the exact Axe Digital project reference:

   ```powershell
   supabase link --project-ref <AXE_DIGITAL_PROJECT_REF>
   ```

3. Review `supabase/migrations/20260828000100_employment_applications.sql`, then apply it to the linked Axe Digital project when authorized:

   ```powershell
   supabase db push
   ```

4. Confirm in Supabase that `employment_applications` exists, RLS is enabled and forced, and `employment-resumes` is private.
5. Create a Resend API key. For development, either:
   - use `Axe Build Careers <onboarding@resend.dev>` and set the recipient to the email address associated with the Resend account; or
   - verify an Axe-controlled sending domain and use a sender on that domain.

   The `resend.dev` sender cannot deliver to arbitrary recipients. See [Resend's development sender restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

6. Create `.env.local` with real values. Never commit this file:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=<AXE_DIGITAL_SUPABASE_URL>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<AXE_DIGITAL_ANON_KEY>
   SUPABASE_SERVICE_ROLE_KEY=<AXE_DIGITAL_SERVICE_ROLE_KEY>
   APPLICATION_RECIPIENT_EMAIL=<DEVELOPMENT_RECIPIENT>
   APPLICATION_FROM_EMAIL=<VERIFIED_OR_RESEND_DEVELOPMENT_SENDER>
   RESEND_API_KEY=<RESEND_API_KEY>
   PRIVACY_CONTACT_EMAIL=<APPROVED_PUBLIC_PRIVACY_CONTACT>
   ```

7. Prepare a test PDF under 5 MB containing synthetic information only. Do not use a real applicant or real PII.
8. Start the site with `npm run dev` or `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-dev.ps1`.

## Test 1 — Phone submission with PDF resume

1. Open `/careers` on a phone or a mobile-sized browser.
2. Confirm Career Area contains exactly Construction, Welding & Fabrication, Machine Operation, Painting & Coatings, and General Application.
3. Complete all seven required fields with synthetic data.
4. Add an optional message and attach the test PDF.
5. Select **Submit Application** twice rapidly.
6. Confirm the button immediately becomes disabled and displays **Submitting application…**.
7. Confirm only one `employment_applications` row is created.
8. Confirm the form is replaced by **APPLICATION RECEIVED** and the approved What to Expect hiring-process message.

## Test 2 — Durable application record

1. In the Supabase dashboard for Axe Digital, open Table Editor or use a read-only SQL query:

   ```sql
   select
     id,
     submitted_at,
     career_area,
     application_status,
     email_delivery_status,
     resume_storage_path,
     resume_original_filename,
     resume_mime_type,
     resume_size_bytes
   from public.employment_applications
   order by submitted_at desc
   limit 5;
   ```

2. Confirm the row contains the submitted values, `application_status = 'new'`, and complete resume metadata.
3. Confirm no extra applicant fields were collected.

## Test 3 — Private resume object

1. In Supabase Storage, open the private `employment-resumes` bucket.
2. Confirm the object path is `<application-id>/<sanitized-original-filename>`.
3. Confirm the bucket is not public and no public URL is generated.
4. Download the object through the authenticated dashboard and confirm it is byte-for-byte the original test PDF.

## Test 4 — Applicant-summary PDF and email package

1. Open the message sent to `APPLICATION_RECIPIENT_EMAIL`.
2. Confirm the subject is `NEW APPLICANT — <Full Name> — <Career Area>`.
3. Confirm the body contains applicant name, career area, phone, email, submission timestamp, and application ID.
4. Open `Axe_Applicant_<sanitized-name>_<application-id-short>.pdf` and confirm:
   - Axe Build branding is readable.
   - Application ID and submitted time are correct.
   - All applicant text appears exactly as submitted after whitespace normalization.
   - Optional message is present.
   - Resume line names the original file.
5. Confirm the original test resume is the second attachment and is unchanged.
6. Confirm the row has `email_delivery_status = 'sent'`, attempted/delivered timestamps, and a provider message ID.

## Test 5 — Application without a resume

1. Submit a second synthetic application without choosing a resume.
2. Confirm the same success state appears.
3. Confirm the database resume columns are all null.
4. Confirm no storage object was created for that application ID.
5. Confirm the email contains only the applicant-summary PDF.
6. Confirm the PDF says `No resume provided.`

## Test 6 — Validation failures

Verify each case retains the entered form and shows a human-readable error:

1. Missing required field.
2. Invalid email.
3. Tampered request with an unapproved career area.
4. Empty relevant experience.
5. Resume larger than 5 MB.
6. Unsupported extension such as `.exe`, `.zip`, `.jpg`, or `.txt`.
7. Renamed or masquerading file whose content does not match PDF/DOCX.

Confirm none of these creates a database row or storage object.

## Test 7 — Email failure after durable storage

1. Temporarily set `RESEND_API_KEY` to an invalid development value, or set an unverified sender that causes Resend to reject delivery. Restart the local server so it receives the changed environment.
2. Submit a synthetic application with a test resume.
3. Confirm the applicant still sees **APPLICATION RECEIVED**.
4. Confirm the database row remains present.
5. Confirm the private resume remains present.
6. Confirm the row has `email_delivery_status = 'failed'`, an attempted timestamp, no delivered timestamp, and a short server-safe error summary.
7. Confirm no raw provider or database error appears in the browser.
8. Restore the valid Resend configuration and restart the server.

## Test 8 — Public access denial

1. Using only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, attempt to select from `employment_applications` through the Supabase REST API. Confirm the request is denied and returns no rows.
2. Using only the anon key, attempt to list or download objects from `employment-resumes`. Confirm the request is denied and no object names or files are returned.
3. Confirm `GET /api/careers/applications` is not implemented and does not return application data.
4. Inspect the browser's loaded JavaScript and network requests. Confirm neither `SUPABASE_SERVICE_ROLE_KEY` nor `RESEND_API_KEY` appears.

## Test 9 — Production build and regression

1. Run:

   ```powershell
   npm test
   npm run lint
   npm run build
   ```

2. Confirm Home, Careers, What We Do, About, Contact, Privacy, and the mobile menu still render.
3. With all backend environment values absent, confirm public pages still render and a submission attempt returns the safe temporarily-unavailable message rather than exposing a configuration error.

## Cleanup

1. Delete only the synthetic test rows and their matching test resume objects after evidence is recorded and cleanup is approved.
2. Never delete or alter a real applicant record during testing.
3. Record the test date, tester, Supabase project reference, deployment URL, application IDs, email results, and any defects outside the repository.
