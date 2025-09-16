# Abex Transport Landing Page

This project delivers the Abex Transport marketing site built with React, Vite, and Tailwind CSS. Content is managed through Decap CMS and global configuration now lives in Firebase.

## Getting Started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and provide your Firebase web app config plus the Firestore document path for global settings.
3. Start the dev server with `npm run dev`.

## Firebase Integration

- Firebase Authentication and Hosting power customer logins and static asset delivery.
- A Firestore document supplies key/value "globals" that the UI consumes through the GlobalsProvider. The document path is set by `VITE_FIRESTORE_GLOBALS_DOC` and should contain string values like `business_name`.

## Deployment

The site builds to the `dist/` directory via `npm run build`. You can deploy the output to Firebase Hosting (recommended) or any static host like Vercel. See `DEPLOYMENT.md` for platform-specific notes.
