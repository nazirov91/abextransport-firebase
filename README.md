# Abex Transport Landing Page

This project delivers the Abex Transport marketing site built with React, Vite, and Tailwind CSS. Content is managed through Decap CMS and global configuration now lives in Firebase.

## Getting Started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and provide your Firebase web app config plus the Firestore document path for global settings.
3. Start the dev server with `npm run dev`.

## Quote Request Webhook

- The `submitQuoteRequest` HTTPS function forwards quote submissions to `https://app.berocker.com/api/v1/auto-logistics/client/webhooks/lead/689df22231b3a/save`.
- Payloads include parsed origin/destination data, vehicle metadata (make, model, year, inoperable status, and type), transport type (`open` or `enclosed`), and customer contact info.
- Accepted vehicle types: `Car`, `sedan`, `Boat`, `Motorcycle`, `Pickup`, `pickup_2_doors`, `SUV`, `Van`, `RV`, `Travel Trailer`, `ATV`, `Convertible`, `Coupe`, `Other`.
- The function is exposed at `/api/quote` locally and in production via Firebase Hosting rewrites, so the client app can call it without hard-coding region-specific URLs.
- The same `VITE_USE_FUNCTIONS_EMULATOR=true` flag makes the quote form target the emulator when running `npm run dev`.

## Customer Support Hub

- The Contact section now highlights real-time concierge options (call, text, email, callback scheduling) instead of a form.
- Update the CTA targets in `client/src/components/ContactSection.tsx` if phone numbers or scheduling links change.
- Because there is no email form, no SendGrid credentials are required for the marketing site any longer.

## Firebase Integration

- Firebase Authentication and Hosting power customer logins and static asset delivery.
- A Firestore document supplies key/value "globals" that the UI consumes through the GlobalsProvider. The document path is set by `VITE_FIRESTORE_GLOBALS_DOC` and should contain string values like `business_name`.
- FAQ entries live inside the Firestore document specified by `VITE_FIRESTORE_FAQ_DOC`. You can either store each field as JSON (`{"question":"..."}`) or use nested maps with `question`, `answer`, and optional numeric `order` keys—the provider handles both.

## Admin Dashboard

- Visit `/admin` to access the management UI.
- Sign in with a Firebase email/password user (enable Email/Password auth in Firebase Console).
- Update business name, tagline, phone, email, MC, and DOT numbers from the Business Information card. Changes merge into the globals document.
- Manage FAQs by adding, editing, or deleting entries, which synchronise with the configured Firestore collection in real time.

## Deployment

The site builds to the `dist/` directory via `npm run build`. You can deploy the output to Firebase Hosting (recommended) or any static host like Vercel. See `DEPLOYMENT.md` for platform-specific notes.
