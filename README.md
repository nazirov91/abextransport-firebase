# Abex Transport Landing Page

This project delivers the Abex Transport marketing site built with React, Vite, and Tailwind CSS. Content is managed through Decap CMS and global configuration now lives in Firebase.

## Getting Started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and provide your Firebase web app config plus the Firestore document path for global settings.
3. Start the dev server with `npm run dev`.

## Contact Form Email Function

- A Firebase HTTPS function named `submitContactForm` relays contact form submissions to `contact@abextransport.com` through SendGrid.
- Install its dependencies with `cd functions && npm install` before running locally or deploying with `firebase deploy --only functions`.
- The web app resolves the endpoint automatically using `VITE_FIREBASE_PROJECT_ID`; set `VITE_FIREBASE_FUNCTIONS_REGION` if you deploy outside the default `us-central1` region.
- Provide the SendGrid API key via `SENDGRID_API_KEY` environment variable (e.g. `firebase functions:config:set sendgrid.key="..."`) and rotate/revoke any previously exposed keys.

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
