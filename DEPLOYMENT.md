# Multi-Platform Deployment Guide

This project is configured to deploy to multiple platforms while maintaining Replit compatibility.

## Platform Configurations

### Replit (Current Setup)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Status**: ✅ Active and working

### Netlify
Removed. This project no longer includes Netlify configuration or workflows.

### Vercel
- **Configuration File**: `vercel.json`
- **Build Command**: `bash build-scripts/static-build.sh`
- **Output Directory**: `dist`
- **Features**:
  - SPA routing support
  - Optimized caching
  - Zero-config deployment

**Deployment**:
1. Connect GitHub repo to Vercel
2. Vercel will automatically use `vercel.json` configuration

### Firebase Hosting + Firestore
- **Authentication & Hosting**: Configure Firebase Authentication and Hosting in your Firebase project
- **Firestore Globals**: Store site-wide settings in a Firestore document referenced by `VITE_FIRESTORE_GLOBALS_DOC`
- **Firebase SDK Config**: Provide the web app config via the `.env` variables in `.env.example`

**Deployment**:
1. Install the Firebase CLI and run `firebase login`
2. Configure `firebase.json` (if not already) to serve the built `dist` directory
3. Deploy with `firebase deploy --only hosting`
4. Ensure Firestore rules allow read access for the public globals document or implement authentication flows

### Decap CMS
- **Admin Interface**: `/admin/`
- **Configuration**: `client/admin/config.yml`
- **Content Storage**: `content/` directory
- **Features**:
  - Content management for pages, testimonials, FAQ
  - Git-based workflow
  - Local development support

**Setup**:
1. Configure your preferred authentication method (if needed)
2. Deploy to your chosen static host
3. Access admin at `/admin/` after deployment

### Generic Static Hosting
- **Build Script**: `build-scripts/static-build.sh`
- **Output**: Standard `dist/` directory structure
- **Compatible with**: GitHub Pages, CloudFlare Pages, Firebase Hosting, etc.

## Build Output Compatibility

The build system handles different output directory expectations:

- **Replit**: Expects `dist/public/`
- **Others**: Expect `dist/`

The build scripts automatically handle this conversion while maintaining compatibility.

## Content Management

Content is managed through:
1. **Static files**: Direct editing of files in `content/`
2. **Decap CMS**: Visual interface at `/admin/`
3. **Git workflow**: All changes are version controlled

## Environment Variables

For different deployment environments, set:
- `NODE_ENV=production` (automatically set by most platforms)
- `VITE_BUILD_TARGET=static` (for non-Replit deployments)

## Testing Locally

1. **Development**: `npm run dev`
2. **Build test**: `npm run build`
3. **Preview**: `npm run preview`
4. **CMS local**: `npx decap-server` (then visit `/admin/`)

## File Structure

```
├── vercel.json              # Vercel configuration
├── client/
│   └── admin/               # Decap CMS admin
├── build-scripts/           # Cross-platform build scripts
├── content/                 # CMS content files
└── .github/workflows/       # CI/CD workflows (Netlify workflow removed)
```
