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

Forms currently validate locally and do not imply submission. A later phase should add server actions or route handlers with server-side validation, rate limiting, spam controls, explicit responses, audit logging, and an approved retention policy.

## Proposed future tables

No tables or migrations have been created or applied.

- `job_openings`: approved public job postings, status, career area, location, description, and publish dates
- `employment_applications`: applicant details, position/general-interest relationship, workflow status, and consent timestamps
- `contact_submissions`: general inquiries and routing state
- `quote_requests`: project inquiry details and routing state
- `media_submissions`: incoming Axe Media Drop assets, submitter, consent, review, and storage references
- `media_content_usage`: approved placement, channel, usage dates, rights status, and asset relationships

Resume and media files should use private object storage, signed access, strict policies, file checks, and documented deletion schedules. Rows should store object references rather than public URLs.

## Content flow

Job listings should be queried server-side and filtered to approved, published records. Public forms should post to server-only handlers, never directly with elevated credentials. Approved media must remain independent from operational/material-management data.

## Accessibility and performance

The interface uses semantic sections, labeled fields, keyboard-accessible navigation, visible focus states, reduced-motion support, responsive layouts, and high-contrast colors. Future media must include useful alternative text or captions, optimized formats, explicit dimensions, and restrained autoplay behavior.
