# Axe Build Careers Admin Guide

## Access and sign-in

1. Confirm your Axe work email has been provisioned in Supabase Auth and is included in the server-only `CAREERS_ADMIN_EMAILS` environment variable.
2. Open `/admin/careers` on the current Axe Digital site.
3. Enter your approved email and select **Email Sign-In Link**.
4. Open the Supabase magic link in the same browser. There is no public signup; the server denies every account not on the allowlist.

## Create a reusable template

1. Under **Templates**, select **+ New Template**.
2. Enter a clear internal template name and the required job title, description, duties, experience, schedule, and location. Pay range is optional.
3. Select **Save Template**.

Editing a template does not change an existing posting. This preserves the exact wording that was published historically.

## Create a posting from a template

1. Find the template and select **Create Posting From Template**.
2. A separate draft posting is created with a copy of the template content.
3. Open the draft under **Posting History & Drafts**, review it, and publish when ready.

## Create a posting from scratch

1. Under **Open Postings**, select **+ New Job Posting**.
2. Complete the required fields. Pay range may remain blank.
3. Select **Save Draft** for private review or **Publish** to make it public immediately.

## Edit and publish

- **Edit** opens the current posting content.
- **Save Changes** preserves an open posting as open, or a non-public posting as a draft.
- **Publish** validates the required fields, marks the posting open, and makes it available on Careers and its job-detail URL.
- **Save Draft** keeps the posting private.

Only `open` postings are public. `draft`, `filled`, `closed`, and `archived` postings remain private and retained for history.

## Fill, close, and archive

- **Mark Filled** records the filled timestamp and removes the posting from public pages.
- **Close** records the closed timestamp and removes the posting from public pages.
- **Archive** preserves a non-public historical record; it does not delete it.

## Download the posting PDF

Select **Download PDF** beside any posting. The server regenerates the PDF from current stored posting data, so no stale PDF is retained. If pay range is blank, that section is omitted.

The QR code points to `${PUBLIC_SITE_URL}/careers`. Set `PUBLIC_SITE_URL=http://localhost:3000` locally, a preview origin while testing, and `https://axebuild.com` in production. The PDF contains no applicant or administrative data.

## Job-specific applications

Applicants who use **Apply** from a posting see the role above the existing application form. The server verifies that the posting is still open and stores its ID with the application. The applicant-summary PDF and internal notification include the job title. General applications continue to use no posting ID.
